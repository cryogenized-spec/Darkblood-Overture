import Phaser from 'phaser';

const FRAME = {
  dormant: 0,
  shadowStir: 1,
  beginRise: 2,
  firstRise: 3,
  halfSettle: 4,
  secondRise: 5,
  fullStance: 6,
  settle: 7,
  headLifting: 8,
  headUp: 9,
  eyesAwaken: 10,
  lifeforceSurge: 11,
  conscious: 12,
};

export class ArabellaAwakeningSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'arabella-preact1', FRAME.dormant);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
    this.setScale(1.25);
    this.available = scene.textures.exists('arabella-preact1');
    if (!this.available) this.setVisible(false);
  }

  frame(name) {
    if (!this.available) return;
    const index = FRAME[name];
    if (index !== undefined) this.setFrame(index);
  }

  useArtworkFrame(name) {
    this.frame(name);
  }
}

export { FRAME as ARABELLA_AWAKENING_FRAMES };
