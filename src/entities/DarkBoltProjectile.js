import {
  DARK_BOLT_PROJECTILE_DISPLAY_HEIGHT,
  DARK_BOLT_PROJECTILE_FRAME_MS,
  DARK_BOLT_PROJECTILE_MAX_LIFETIME_MS,
  DARK_BOLT_PROJECTILE_SPEED,
  DARK_BOLT_PROJECTILE_FRAMES,
  DARK_BOLT_PROJECTILE_TEXTURE_KEYS,
} from '../data/darkBoltFrames.js';

export class DarkBoltProjectile {
  static create(scene, x, y, direction = 1) {
    const firstKey = DARK_BOLT_PROJECTILE_TEXTURE_KEYS.flightA;
    if (!scene.textures.exists(firstKey)) {
      throw new Error(`Dark Bolt projectile texture '${firstKey}' was not loaded before GameScene.`);
    }

    const sprite = scene.add.sprite(x, y, firstKey);
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
    sprite.setFlipX(sprite.direction < 0);

    const applyFrameScale = () => {
      const source = sprite.texture.getSourceImage();
      if (!source || source.height <= 0) {
        throw new Error('Dark Bolt projectile texture has invalid source dimensions.');
      }
      sprite.setScale(sprite.baseHeight / source.height);
    };

    sprite.setArtworkFrame = (name) => {
      const frame = DARK_BOLT_PROJECTILE_FRAMES.find((entry) => entry.name === name);
      if (!frame) throw new Error(`Unknown Dark Bolt projectile frame '${name}'.`);
      const nextKey = DARK_BOLT_PROJECTILE_TEXTURE_KEYS[name];
      if (!scene.textures.exists(nextKey)) {
        throw new Error(`Dark Bolt projectile texture '${name}' is missing.`);
      }
      sprite.setTexture(nextKey);
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
