import Phaser from 'phaser';
import { ARABELLA_AWAKENING_FRAMES, ARABELLA_SPRITE_SIZE, ARABELLA_TEXTURE_KEYS } from '../data/arabellaAwakeningFrames.js';

export class ArabellaAwakeningSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    const textureKey = ARABELLA_TEXTURE_KEYS.dormant;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella texture '${textureKey}' was not loaded before AwakeningScene.`);
    }

    super(scene, x, y, textureKey);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
    this.setScale(1);
    this.setVisible(true);
    this.setAlpha(1);
    this.baseHeight = ARABELLA_SPRITE_SIZE.height;
  }

  frame(name) {
    const frame = ARABELLA_AWAKENING_FRAMES.find((entry) => entry.name === name);
    if (!frame) return;

    const textureKey = ARABELLA_TEXTURE_KEYS[name];
    if (!this.scene.textures.exists(textureKey)) {
      throw new Error(`Arabella texture '${textureKey}' is missing.`);
    }

    this.setTexture(textureKey);
    this.setVisible(true);
  }

  setLunarCharge(active) {
    this.setTint(active ? 0xf0dff4 : 0xffffff);
  }

  useArtworkFrame(name) {
    this.frame(name);
  }
}
