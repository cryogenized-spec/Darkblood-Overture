import Phaser from 'phaser';
import {
  ARABELLA_FRAME,
  ARABELLA_PIXEL,
  ARABELLA_TEXTURE_KEYS,
  buildArabellaTexture,
} from '../pixel/arabellaPixelArt.js';

export class ArabellaAwakeningSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    buildArabellaTexture(scene);
    super(scene, x, y, ARABELLA_TEXTURE_KEYS.dormant);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
    this.setScale(1);
    this.baseHeight = ARABELLA_PIXEL.height;
  }

  frame(name) {
    const textureKey = ARABELLA_TEXTURE_KEYS[name];
    if (textureKey) this.setTexture(textureKey);
  }

  setLunarCharge(active) {
    this.setTint(active ? 0xf0dff4 : 0xffffff);
  }

  useArtworkFrame(name) {
    this.frame(name);
  }
}

export { ARABELLA_FRAME as ARABELLA_AWAKENING_FRAMES };
