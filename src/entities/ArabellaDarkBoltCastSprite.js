import {
  DARK_BOLT_CAST_DISPLAY_HEIGHT,
  DARK_BOLT_CAST_FRAME_MS,
  DARK_BOLT_CAST_FRAMES,
  DARK_BOLT_CAST_TEXTURE_KEYS,
} from '../data/darkBoltFrames.js';

export class ArabellaDarkBoltCastSprite {
  static create(scene, x, y) {
    const firstKey = DARK_BOLT_CAST_TEXTURE_KEYS.ready;
    if (!scene.textures.exists(firstKey)) {
      throw new Error(`Dark Bolt cast texture '${firstKey}' was not loaded before GameScene.`);
    }

    const sprite = scene.add.sprite(x, y, firstKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(21);
    sprite.setVisible(false);
    sprite.setScrollFactor(1);
    sprite.baseHeight = DARK_BOLT_CAST_DISPLAY_HEIGHT;
    sprite.sequenceIndex = 0;
    sprite.frameTimer = 0;

    const applyFrameScale = () => {
      const source = sprite.texture.getSourceImage();
      if (!source || source.height <= 0) {
        throw new Error('Dark Bolt cast texture has invalid source dimensions.');
      }
      sprite.setScale(sprite.baseHeight / source.height);
    };

    sprite.setArtworkFrame = (name) => {
      const frame = DARK_BOLT_CAST_FRAMES.find((entry) => entry.name === name);
      if (!frame) throw new Error(`Unknown Dark Bolt cast frame '${name}'.`);
      const nextKey = DARK_BOLT_CAST_TEXTURE_KEYS[name];
      if (!scene.textures.exists(nextKey)) {
        throw new Error(`Dark Bolt cast texture '${name}' is missing.`);
      }
      sprite.setTexture(nextKey);
      applyFrameScale();
    };

    sprite.beginCast = () => {
      sprite.sequenceIndex = 0;
      sprite.frameTimer = 0;
      sprite.setArtworkFrame('ready');
      sprite.setVisible(true);
    };

    sprite.updateCast = (deltaMs) => {
      if (!sprite.visible) return { done: true, released: false };
      sprite.frameTimer += deltaMs;
      let released = false;
      while (sprite.frameTimer >= DARK_BOLT_CAST_FRAME_MS) {
        sprite.frameTimer -= DARK_BOLT_CAST_FRAME_MS;
        sprite.sequenceIndex += 1;
        if (sprite.sequenceIndex >= DARK_BOLT_CAST_FRAMES.length) {
          sprite.setVisible(false);
          return { done: true, released: false };
        }
        const frameName = DARK_BOLT_CAST_FRAMES[sprite.sequenceIndex].name;
        sprite.setArtworkFrame(frameName);
        if (frameName === 'release') released = true;
      }
      return { done: false, released };
    };

    applyFrameScale();
    return sprite;
  }
}
