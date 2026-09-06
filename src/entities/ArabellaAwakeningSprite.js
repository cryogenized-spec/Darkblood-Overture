import {
  ARABELLA_AWAKENING_FRAMES,
  ARABELLA_AWAKENING_REFERENCE_FRAME,
  ARABELLA_SPRITE_DISPLAY_HEIGHT,
  ARABELLA_TEXTURE_KEYS,
} from '../data/arabellaAwakeningFrames.js';

// Frames are tightly cropped to the figure, so anchoring the origin at the
// bottom keeps her feet planted exactly on the ground line with no offset —
// and keeps the fully-upright pose aligned with the in-game idle sprite.
const AWAKENING_VISUAL_OFFSET_Y = 0;

export class ArabellaAwakeningSprite {
  // All frames share a single scale factor derived from one reference frame.
  // This keeps Arabella's feet planted on the ground and lets the sequence read
  // as a rise instead of the sprite ballooning and "jumping" between keyframes.
  static resolveScale(scene) {
    const key = ARABELLA_TEXTURE_KEYS[ARABELLA_AWAKENING_REFERENCE_FRAME];
    const source = scene.textures.get(key)?.getSourceImage();
    if (!source || source.height <= 0) {
      throw new Error(`Arabella reference texture '${key}' has invalid source dimensions.`);
    }
    return ARABELLA_SPRITE_DISPLAY_HEIGHT / source.height;
  }

  static create(scene, x, y) {
    const textureKey = ARABELLA_TEXTURE_KEYS.dormant;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella texture '${textureKey}' was not loaded before AwakeningScene.`);
    }

    const sprite = scene.add.sprite(x, y + AWAKENING_VISUAL_OFFSET_Y, textureKey);
    const scale = ArabellaAwakeningSprite.resolveScale(scene);

    sprite.setOrigin(0.5, 1);
    sprite.setDepth(20);
    sprite.setVisible(true);
    sprite.setAlpha(1);
    sprite.setScrollFactor(0);
    sprite.baseHeight = ARABELLA_SPRITE_DISPLAY_HEIGHT;
    sprite.awakeningScale = scale;
    sprite.setScale(scale);

    sprite.setArtworkFrame = (name) => {
      const frame = ARABELLA_AWAKENING_FRAMES.find((entry) => entry.name === name);
      if (!frame) throw new Error(`Unknown Arabella awakening frame '${name}'.`);

      const nextKey = ARABELLA_TEXTURE_KEYS[name];
      if (!scene.textures.exists(nextKey)) {
        throw new Error(`Arabella texture '${name}' is missing.`);
      }

      sprite.setTexture(nextKey);
      sprite.setScale(sprite.awakeningScale);
      sprite.setVisible(true);
    };

    sprite.setLunarCharge = (active) => {
      sprite.setTint(active ? 0xf0dff4 : 0xffffff);
    };

    return sprite;
  }
}
