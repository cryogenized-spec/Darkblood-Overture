import Phaser from 'phaser';
import { ARABELLA_FRAME, buildArabellaTexture, ARABELLA_PIXEL } from '../pixel/arabellaPixelArt.js';

export class ArabellaAwakeningSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'arabella-pixel-awakening', ARABELLA_FRAME.dormant);
    buildArabellaTexture(scene);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
    this.setScale(1);
    this.baseHeight = ARABELLA_PIXEL.height;
  }

  frame(name) {
    const index = ARABELLA_FRAME[name];
    if (index !== undefined) this.setFrame(index);
  }

  setLunarCharge(active) {
    this.setTint(active ? 0xf0dff4 : 0xffffff);
  }

  useArtworkFrame(name) {
    this.frame(name);
  }
}

export { ARABELLA_FRAME as ARABELLA_AWAKENING_FRAMES };
