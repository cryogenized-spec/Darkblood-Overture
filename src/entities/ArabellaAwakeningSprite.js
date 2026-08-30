import Phaser from 'phaser';
import {
  ARABELLA_FRAME,
  ARABELLA_PIXEL,
  ARABELLA_TEXTURE_KEYS,
} from '../pixel/arabellaPixelArt.js';

export class ArabellaAwakeningSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    const textureKey = ARABELLA_TEXTURE_KEYS.dormant;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella texture '${textureKey}' was not prepared before AwakeningScene.`);
    }

    super(scene, x, y, textureKey);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
    this.setScale(1);
    this.setVisible(true);
    this.setAlpha(1);
    this.baseHeight = ARABELLA_PIXEL.height;
  }

  frame(name) {
    const textureKey = ARABELLA_TEXTURE_KEYS[name];
    if (textureKey) {
      if (!this.scene.textures.exists(textureKey)) {
        throw new Error(`Arabella texture '${textureKey}' is missing.`);
      }
      this.setTexture(textureKey);
      this.setVisible(true);
    }
  }

  setLunarCharge(active) {
    this.setTint(active ? 0xf0dff4 : 0xffffff);
  }

  useArtworkFrame(name) {
    this.frame(name);
  }
}

export { ARABELLA_FRAME as ARABELLA_AWAKENING_FRAMES };
