import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');

    const level = createLevel01Runtime();
    this.registry.set('currentLevel', level);

    // Pass 1 intentionally stops here. The next pass will populate the three
    // parallax planes, ground and Queen gameplay layer.
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, 'LEVEL 01', {
      color: '#f4f0e7',
      fontFamily: 'Georgia, serif',
      fontSize: '10px',
      letterSpacing: 3,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 7, 'GRAVEYARD — FOUNDATION PLACEHOLDER', {
      color: '#69616e',
      fontFamily: 'monospace',
      fontSize: '5px',
      letterSpacing: 1,
    }).setOrigin(0.5);
  }
}
