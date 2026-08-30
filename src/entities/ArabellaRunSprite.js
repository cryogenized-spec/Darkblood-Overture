import {
  ARABELLA_RUN_DISPLAY_HEIGHT,
  ARABELLA_RUN_FRAMES,
  ARABELLA_RUN_TEXTURE_KEYS,
} from '../data/arabellaRunFrames.js';

const LEFT_SEQUENCE = ['contactLeft', 'downLeft', 'passingLeft', 'upLeft', 'transitionLeft', 'settleLeft'];
const RIGHT_SEQUENCE = ['contactRight', 'downRight', 'passingRight', 'upRight', 'transitionRight', 'settleRight'];
const RUN_FRAME_MS = 90;

export class ArabellaRunSprite {
  static create(scene, x, y) {
    const textureKey = ARABELLA_RUN_TEXTURE_KEYS.contactRight;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella run texture '${textureKey}' was not loaded before GameScene.`);
    }

    const sprite = scene.add.sprite(x, y, textureKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(20);
    sprite.setVisible(true);
    sprite.setAlpha(1);
    sprite.setScrollFactor(0);
    sprite.baseHeight = ARABELLA_RUN_DISPLAY_HEIGHT;
    sprite.facing = 'right';
    sprite.running = false;
    sprite.sequenceIndex = 0;
    sprite.frameTimer = 0;

    const applyFrameScale = () => {
      const source = sprite.texture.getSourceImage();
      if (!source || source.height <= 0) {
        throw new Error('Arabella run texture has invalid source dimensions.');
      }

      sprite.setScale(sprite.baseHeight / source.height);
    };

    sprite.setFacing = (direction) => {
      sprite.facing = direction === 'left' ? 'left' : 'right';
    };

    sprite.startRun = () => {
      sprite.running = true;
    };

    sprite.stopRun = () => {
      if (!sprite.running) return;
      sprite.running = false;
      sprite.sequenceIndex = 0;
      sprite.frameTimer = 0;
      sprite.setArtworkFrame(sprite.facing === 'left' ? 'contactLeft' : 'contactRight');
    };

    sprite.updateRun = (deltaMs) => {
      if (!sprite.running) return;
      sprite.frameTimer += deltaMs;
      while (sprite.frameTimer >= RUN_FRAME_MS) {
        sprite.frameTimer -= RUN_FRAME_MS;
        const sequence = sprite.facing === 'left' ? LEFT_SEQUENCE : RIGHT_SEQUENCE;
        sprite.sequenceIndex = (sprite.sequenceIndex + 1) % sequence.length;
        sprite.setArtworkFrame(sequence[sprite.sequenceIndex]);
      }
    };

    sprite.setArtworkFrame = (name) => {
      if (!ARABELLA_RUN_FRAMES.some((entry) => entry.name === name)) {
        throw new Error(`Unknown Arabella run frame '${name}'.`);
      }

      const nextKey = ARABELLA_RUN_TEXTURE_KEYS[name];
      if (!scene.textures.exists(nextKey)) {
        throw new Error(`Arabella run texture '${name}' is missing.`);
      }

      sprite.setTexture(nextKey);
      applyFrameScale();
      sprite.setVisible(true);
    };

    applyFrameScale();
    return sprite;
  }
}
