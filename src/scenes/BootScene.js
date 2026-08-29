import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.spritesheet('arabella-preact1', '/assets/characters/arabella/PREACT1_QUEEN.png', {
      frameWidth: 96,
      frameHeight: 112,
      endFrame: 12,
    });
  }

  create() {
    this.scene.start('DevSplashScene');
  }
}
