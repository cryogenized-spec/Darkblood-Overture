import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';
import { LORE } from '../data/lore.js';
import { ArabellaPlayer } from '../entities/ArabellaPlayer.js';
import { GameHUD } from '../ui/GameHUD.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { PlayerController } from '../input/PlayerController.js';
import { createGraveyardBackdrop } from '../world/GraveyardBackdrop.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');
    const level = createLevel01Runtime();
    this.registry.set('currentLevel', level);
    this.registry.set('lore', LORE);

    this.player = ArabellaPlayer.create(this, GAME_WIDTH / 2, level.ground.y);
    this.player.setWorldBounds(32, level.world.width - 32);

    this.cameras.main.setBounds(0, 0, level.world.width, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);

    this.backdrop = createGraveyardBackdrop(this);

    this.hud = new GameHUD(this);
    this.hud.setHealth(1);
    this.hud.setSpellEnabled(true);
    this.pauseMenu = new PauseMenu(this);

    this.controls = new PlayerController(this, 70);

    this.input.keyboard?.on('keydown-ESC', this.togglePause, this);
    this.events.once('shutdown', () => {
      this.input.keyboard?.off('keydown-ESC', this.togglePause, this);
      this.controls?.destroy();
      this.backdrop?.destroy();
      this.hud?.destroy();
    });
  }

  update(_time, delta) {
    if (!this.player || !this.controls || this.pauseMenu?.isOpen) return;
    this.controls.update(this.player, delta / 1000);
    this.player.updateAnimations(delta);
  }

  togglePause() {
    this.pauseMenu?.toggle();
  }
}
