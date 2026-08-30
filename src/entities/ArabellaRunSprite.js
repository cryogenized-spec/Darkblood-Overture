import Phaser from 'phaser';
import {
  ARABELLA_RUN_DISPLAY_HEIGHT,
  ARABELLA_RUN_FRAMES,
  ARABELLA_RUN_TEXTURE_KEYS,
} from '../data/arabellaRunFrames.js';

export class ArabellaRunSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    const textureKey = ARABELLA_RUN_TEXTURE_KEYS.contactRight;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella run texture '${textureKey}' was not loaded before GameScene.`);
    }

    super(scene, x, y, textureKey);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
    this.setVisible(true);
    this.baseHeight = ARABELLA_RUN_DISPLAY_HEIGHT;
    this.applyFrameScale();
  }

  frame(name) {
    const frame = ARABELLA_RUN_FRAMES.find((entry) => entry.name === name);
    if (!frame) return;

    const textureKey = ARABELLA_RUN_TEXTURE_KEYS[name];
    if (!this.scene.textures.exists(textureKey)) {
      throw new Error(`Arabella run texture '${textureKey}' is missing.`);
    }

    this.setTexture(textureKey);
    this.applyFrameScale();
  }

  applyFrameScale() {
    const source = this.texture.getSourceImage();
    if (!source || source.height <= 0) {
      throw new Error('Arabella run texture has invalid source dimensions.');
    }

    this.setScale(this.baseHeight / source.height);
  }
}
