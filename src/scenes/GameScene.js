import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';
import { ArabellaRunSprite } from '../entities/ArabellaRunSprite.js';
import { GameHUD } from '../ui/GameHUD.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { PlayerController } from '../input/PlayerController.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');
    this.registry.set('currentLevel', createLevel01Runtime());

    this.createWorldFoundation();
    this.hud = new GameHUD(this);
    this.hud.setHealth(1);
    this.hud.setSpellEnabled(true);
    this.pauseMenu = new PauseMenu(this);

    this.player = new ArabellaRunSprite(this, GAME_WIDTH / 2, 155);
    this.controls = new PlayerController(this, 70);

    this.input.keyboard?.on('keydown-ESC', this.togglePause, this);
    this.events.once('shutdown', () => {
      this.input.keyboard?.off('keydown-ESC', this.togglePause, this);
      this.controls?.destroy();
      this.hud?.destroy();
    });
  }

  createWorldFoundation() {
    this.add.rectangle(GAME_WIDTH / 2, 120, GAME_WIDTH, 120, 0x06060a, 1).setDepth(0);
    this.add.circle(262, 38, 22, 0x6d5a82, 0.2).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 2, 160, GAME_WIDTH, 40, 0x0d0a11, 1).setDepth(2);
    this.add.line(0, 140, 0, 0, GAME_WIDTH, 0, 0x47364e, 0.7).setOrigin(0).setDepth(3);

    this.add.text(GAME_WIDTH / 2, 172, 'LEVEL 01  •  GRAVEYARD', {
      color: '#433a48',
      fontFamily: 'monospace',
      fontSize: '4px',
      letterSpacing: 1,
    }).setOrigin(0.5).setDepth(3);
  }

  update(_time, delta) {
    if (!this.player || !this.controls || this.pauseMenu?.isOpen) return;
    this.controls.update(this.player, delta / 1000);
    this.player.updateRun(delta);
  }

  togglePause() {
    this.pauseMenu?.toggle();
  }
}
