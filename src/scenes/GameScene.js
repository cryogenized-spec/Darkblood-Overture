import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';
import { LORE } from '../data/lore.js';
import { DarkBoltProjectile } from '../entities/DarkBoltProjectile.js';
import { ArabellaPlayer } from '../entities/ArabellaPlayer.js';
import { GameHUD } from '../ui/GameHUD.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { PlayerController } from '../input/PlayerController.js';
import { createGraveyardBackdrop } from '../world/GraveyardBackdrop.js';
import { createGroundSurface } from '../world/GroundSurface.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');
    const level = createLevel01Runtime();
    this.registry.set('currentLevel', level);
    this.registry.set('lore', LORE);
    this.projectiles = this.add.group();

    this.player = ArabellaPlayer.create(this, GAME_WIDTH / 2, level.ground.y);
    this.player.setWorldBounds(32, level.world.width - 32);

    this.cameras.main.setBounds(0, 0, level.world.width, GAME_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 1, 1);

    this.backdrop = createGraveyardBackdrop(this);
    this.groundSurface = createGroundSurface(
      this,
      level.world.width,
      level.ground.y,
      level.ground.height,
    );

    this.hud = new GameHUD(this);
    this.hud.setHealth(1);
    this.hud.setSpellEnabled(true);
    this.pauseMenu = new PauseMenu(this);

    this.controls = new PlayerController(this, 70);
    this.onSpell = (event) => {
      if (event.detail?.spell === 'darkBolt') this.player.castDarkBolt?.();
    };
    document.addEventListener('darkblood:spell', this.onSpell);

    this.onJump = () => this.player.jump?.();
    this.events.on('darkblood:jump', this.onJump);

    this.onSpace = (event) => {
      if (event.code === 'Space') this.player.castDarkBolt?.();
    };
    this.input.keyboard?.on('keydown', this.onSpace, this);
    this.input.keyboard?.on('keydown-ESC', this.togglePause, this);

    this.events.once('shutdown', () => {
      this.input.keyboard?.off('keydown', this.onSpace, this);
      this.input.keyboard?.off('keydown-ESC', this.togglePause, this);
      document.removeEventListener('darkblood:spell', this.onSpell);
      this.events.off('darkblood:jump', this.onJump);
      this.controls?.destroy();
      this.backdrop?.destroy();
      this.groundSurface?.destroy();
      this.projectiles?.clear(true, true);
      this.hud?.destroy();
    });
  }

  spawnDarkBolt(x, y, direction) {
    const projectile = DarkBoltProjectile.create(this, x, y, direction);
    this.projectiles.add(projectile);
  }

  update(_time, delta) {
    if (!this.player || !this.controls || this.pauseMenu?.isOpen) return;
    const deltaSeconds = delta / 1000;
    this.controls.update(this.player, deltaSeconds);
    this.player.updatePhysics(deltaSeconds);
    this.player.updateAnimations(delta);

    this.projectiles.getChildren().slice().forEach((projectile) => {
      if (!projectile.active) return;
      projectile.updateProjectile(delta);
    });
  }

  togglePause() {
    this.pauseMenu?.toggle();
  }
}
