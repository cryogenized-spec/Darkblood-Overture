import {
  ARABELLA_AWAKENING_FRAMES,
  ARABELLA_SPRITE_DISPLAY_HEIGHT,
  ARABELLA_TEXTURE_KEYS,
} from '../data/arabellaAwakeningFrames.js';

const AWAKENING_VISUAL_OFFSET_Y = -5;

export class ArabellaAwakeningSprite {
  static create(scene, x, y) {
    const textureKey = ARABELLA_TEXTURE_KEYS.dormant;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella texture '${textureKey}' was not loaded before AwakeningScene.`);
    }

    const sprite = scene.add.sprite(x, y + AWAKENING_VISUAL_OFFSET_Y, textureKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(20);
    sprite.setVisible(true);
    sprite.setAlpha(1);
    sprite.setScrollFactor(0);
    sprite.baseHeight = ARABELLA_SPRITE_DISPLAY_HEIGHT;

    const applyFrameScale = () => {
      const source = sprite.texture.getSourceImage();
      if (!source || source.height <= 0) {
        throw new Error('Arabella texture has invalid source dimensions.');
      }

      sprite.setScale(sprite.baseHeight / source.height);
    };

    sprite.setArtworkFrame = (name) => {
      const frame = ARABELLA_AWAKENING_FRAMES.find((entry) => entry.name === name);
      if (!frame) throw new Error(`Unknown Arabella awakening frame '${name}'.`);

      const nextKey = ARABELLA_TEXTURE_KEYS[name];
      if (!scene.textures.exists(nextKey)) {
        throw new Error(`Arabella texture '${name}' is missing.`);
      }

      sprite.setTexture(nextKey);
      applyFrameScale();
      sprite.setVisible(true);
    };

    sprite.setLunarCharge = (active) => {
      sprite.setTint(active ? 0xf0dff4 : 0xffffff);
    };

    applyFrameScale();
    return sprite;
  }
}
