import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';
import { LORE } from '../data/lore.js';
import { DARK_BOLT_COOLDOWN_MS, DARK_BOLT_DAMAGE } from '../data/darkBoltFrames.js';
import { DarkBoltProjectile } from '../entities/DarkBoltProjectile.js';
import { ArabellaPlayer } from '../entities/ArabellaPlayer.js';
import { GameHUD } from '../ui/GameHUD.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { PlayerController } from '../input/PlayerController.js';
import { SkeletonDirector } from '../systems/SkeletonDirector.js';
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

    this.skeletonDirector = new SkeletonDirector(this, level.ground.y);

    this.hud = new GameHUD(this);
    this.hud.setHealth(this.player.getHealthPercent());
    this.hud.setMana(this.player.mana, this.player.maxMana);
    this.hud.setXp(this.player.getXpPercent(), this.player.level);
    this.hud.setSpellEnabled(true);
    this.hud.setSpellCooldown(0, DARK_BOLT_COOLDOWN_MS);
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
      this.skeletonDirector?.destroy();
      this.hud?.destroy();
    });
  }

  spawnDarkBolt(x, y, direction) {
    const flash = this.add.circle(x, y, 5, 0xe8d7ef, 0.95)
      .setDepth(21)
      .setScale(0.7);
    this.tweens.add({
      targets: flash,
      scale: 2.2,
      alpha: 0,
      duration: 90,
      ease: 'Cubic.out',
      onComplete: () => flash.destroy(),
    });

    const projectile = DarkBoltProjectile.create(this, x, y, direction);
    this.projectiles.add(projectile);
  }

  update(_time, delta) {
    if (!this.player || !this.controls || this.pauseMenu?.visible) return;
    const deltaSeconds = delta / 1000;
    this.controls.update(this.player, deltaSeconds);
    this.player.updatePhysics(deltaSeconds);
    this.player.updateAnimations(delta);
    this.hud?.setHealth(this.player.getHealthPercent());
    this.hud?.setMana(this.player.mana, this.player.maxMana);
    this.hud?.setXp(this.player.getXpPercent(), this.player.level);
    this.hud?.setSpellCooldown(this.player.darkBoltCooldownMs, DARK_BOLT_COOLDOWN_MS);
    this.hud?.setSpellEnabled(this.player.canCastDarkBolt());

    this.skeletonDirector?.update(delta, this.player);

    this.projectiles.getChildren().slice().forEach((projectile) => {
      if (!projectile.active) return;
      projectile.updateProjectile(delta);
      this.resolveProjectileHits(projectile);
    });
  }

  resolveProjectileHits(projectile) {
    if (!projectile.active) return;
    const bounds = projectile.getBounds();
    this.skeletonDirector?.skeletons.slice().forEach((skeleton) => {
      if (!skeleton.active || !skeleton.alive || !projectile.active) return;
      const target = skeleton.getBounds();
      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, target)) {
        skeleton.takeDamage(DARK_BOLT_DAMAGE);
        projectile.destroy();
      }
    });
  }

  togglePause() {
    this.pauseMenu?.toggle();
    this.hud?.setSpellEnabled(this.player.canCastDarkBolt());
  }
}
