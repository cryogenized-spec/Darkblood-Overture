import {
  ARABELLA_IDLE_DISPLAY_HEIGHT,
  ARABELLA_IDLE_FRAMES,
  ARABELLA_IDLE_TEXTURE_KEYS,
} from '../data/arabellaIdleFrames.js';

const IDLE_FRAME_MS = 180;

export class ArabellaIdleSprite {
  static create(scene, x, y) {
    const textureKey = ARABELLA_IDLE_TEXTURE_KEYS.neutral;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella idle texture '${textureKey}' was not loaded before GameScene.`);
    }

    const sprite = scene.add.sprite(x, y, textureKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(20);
    sprite.setVisible(true);
    sprite.setAlpha(1);
    sprite.setScrollFactor(1);
    sprite.baseHeight = ARABELLA_IDLE_DISPLAY_HEIGHT;
    sprite.sequenceIndex = 0;
    sprite.frameTimer = 0;
    sprite.facing = 'right';

    const applyFrameScale = () => {
      const source = sprite.texture.getSourceImage();
      if (!source || source.height <= 0) {
        throw new Error('Arabella idle texture has invalid source dimensions.');
      }
      sprite.setScale(sprite.baseHeight / source.height);
    };

    sprite.setArtworkFrame = (name) => {
      const frame = ARABELLA_IDLE_FRAMES.find((entry) => entry.name === name);
      if (!frame) throw new Error(`Unknown Arabella idle frame '${name}'.`);
      const nextKey = ARABELLA_IDLE_TEXTURE_KEYS[name];
      if (!scene.textures.exists(nextKey)) {
        throw new Error(`Arabella idle texture '${name}' is missing.`);
      }
      sprite.setTexture(nextKey);
      applyFrameScale();
    };

    sprite.updateIdle = (deltaMs) => {
      sprite.frameTimer += deltaMs;
      while (sprite.frameTimer >= IDLE_FRAME_MS) {
        sprite.frameTimer -= IDLE_FRAME_MS;
        sprite.sequenceIndex = (sprite.sequenceIndex + 1) % ARABELLA_IDLE_FRAMES.length;
        sprite.setArtworkFrame(ARABELLA_IDLE_FRAMES[sprite.sequenceIndex].name);
      }
    };

    applyFrameScale();
    return sprite;
  }
}
