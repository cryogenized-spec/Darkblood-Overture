import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCREEN_CONTENT } from '../config/gameConfig.js';

export class DevSplashScene extends Phaser.Scene {
  constructor() {
    super('DevSplashScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');

    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    this.add.text(centerX, centerY - 14, SCREEN_CONTENT.devSplash.studio, {
      color: '#f4f0e7',
      fontFamily: 'Georgia, serif',
      fontSize: '11px',
      letterSpacing: 3,
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 7, SCREEN_CONTENT.devSplash.subline, {
      color: '#8d8990',
      fontFamily: 'monospace',
      fontSize: '5px',
      letterSpacing: 1,
      align: 'center',
    }).setOrigin(0.5);

    this.time.delayedCall(1700, () => {
      this.scene.start('TitleScene');
    });
  }
}
