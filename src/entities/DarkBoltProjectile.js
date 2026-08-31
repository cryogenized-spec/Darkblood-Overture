import {
  DARK_BOLT_PROJECTILE_DISPLAY_HEIGHT,
  DARK_BOLT_PROJECTILE_DISPLAY_WIDTH_SCALE,
  DARK_BOLT_PROJECTILE_FRAME_MS,
  DARK_BOLT_PROJECTILE_MAX_LIFETIME_MS,
  DARK_BOLT_PROJECTILE_SPEED,
  DARK_BOLT_PROJECTILE_FRAMES,
  DARK_BOLT_PROJECTILE_TEXTURE_KEYS,
} from '../data/darkBoltFrames.js';

function getVisibleBounds(source) {
  const ownerDocument = source.ownerDocument;
  if (!ownerDocument) throw new Error('Dark Bolt projectile source does not expose a document.');

  const canvas = ownerDocument.createElement('canvas');
  canvas.width = source.width || source.naturalWidth;
  canvas.height = source.height || source.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Unable to create a canvas context for Dark Bolt cropping.');

  context.drawImage(source, 0, 0);
  const { width, height } = canvas;
  const pixels = context.getImageData(0, 0, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = pixels[(y * width + x) * 4 + 3];
      if (alpha <= 8) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) {
    throw new Error('Dark Bolt projectile contains no visible pixels.');
  }

  return {
    source,
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function getCroppedTexture(scene, sourceKey) {
  const croppedKey = `${sourceKey}-cropped`;
  if (scene.textures.exists(croppedKey)) return croppedKey;

  const source = scene.textures.get(sourceKey).getSourceImage();
  if (!source) throw new Error(`Dark Bolt projectile texture '${sourceKey}' has no source image.`);
  const bounds = getVisibleBounds(source);
  const ownerDocument = source.ownerDocument;
  const canvas = ownerDocument.createElement('canvas');
  canvas.width = bounds.width;
  canvas.height = bounds.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Unable to create a cropped Dark Bolt canvas.');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    bounds.source,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height,
    0,
    0,
    bounds.width,
    bounds.height,
  );
  scene.textures.addCanvas(croppedKey, canvas);
  return croppedKey;
}

export class DarkBoltProjectile {
  static create(scene, x, y, direction = 1) {
    const firstKey = DARK_BOLT_PROJECTILE_TEXTURE_KEYS.flightA;
    if (!scene.textures.exists(firstKey)) {
      throw new Error(`Dark Bolt projectile texture '${firstKey}' was not loaded before GameScene.`);
    }

    const firstCroppedKey = getCroppedTexture(scene, firstKey);
    const sprite = scene.add.sprite(x, y, firstCroppedKey);
    sprite.setOrigin(0.5, 0.5);
    sprite.setDepth(19);
    sprite.setVisible(true);
    sprite.setAlpha(1);
    sprite.setScrollFactor(1);
    sprite.direction = direction < 0 ? -1 : 1;
    sprite.frameTimer = 0;
    sprite.lifetimeMs = 0;
    sprite.sequenceIndex = 0;
    sprite.baseHeight = DARK_BOLT_PROJECTILE_DISPLAY_HEIGHT;
    sprite.widthScale = DARK_BOLT_PROJECTILE_DISPLAY_WIDTH_SCALE;
    sprite.setFlipX(sprite.direction < 0);

    const applyFrameScale = () => {
      const source = sprite.texture.getSourceImage();
      if (!source || source.height <= 0) {
        throw new Error('Dark Bolt projectile texture has invalid source dimensions.');
      }
      const scale = sprite.baseHeight / source.height;
      sprite.setScale(scale * sprite.widthScale, scale);
    };

    sprite.setArtworkFrame = (name) => {
      const frame = DARK_BOLT_PROJECTILE_FRAMES.find((entry) => entry.name === name);
      if (!frame) throw new Error(`Unknown Dark Bolt projectile frame '${name}'.`);
      const nextKey = DARK_BOLT_PROJECTILE_TEXTURE_KEYS[name];
      if (!scene.textures.exists(nextKey)) {
        throw new Error(`Dark Bolt projectile texture '${name}' is missing.`);
      }
      sprite.setTexture(getCroppedTexture(scene, nextKey));
      sprite.setFlipX(sprite.direction < 0);
      applyFrameScale();
    };

    sprite.updateProjectile = (deltaMs) => {
      sprite.x += sprite.direction * DARK_BOLT_PROJECTILE_SPEED * (deltaMs / 1000);
      sprite.frameTimer += deltaMs;
      sprite.lifetimeMs += deltaMs;
      while (sprite.frameTimer >= DARK_BOLT_PROJECTILE_FRAME_MS) {
        sprite.frameTimer -= DARK_BOLT_PROJECTILE_FRAME_MS;
        sprite.sequenceIndex = (sprite.sequenceIndex + 1) % DARK_BOLT_PROJECTILE_FRAMES.length;
        sprite.setArtworkFrame(DARK_BOLT_PROJECTILE_FRAMES[sprite.sequenceIndex].name);
      }

      if (sprite.lifetimeMs >= DARK_BOLT_PROJECTILE_MAX_LIFETIME_MS || sprite.x < -16 || sprite.x > 336) {
        sprite.destroy();
        return false;
      }
      return true;
    };

    applyFrameScale();
    return sprite;
  }
}
