import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';
import { QUEEN } from '../data/queen.js';
import { ArabellaAwakeningSprite } from '../entities/ArabellaAwakeningSprite.js';
import { GameHUD } from '../ui/GameHUD.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { createGraveyardBackdrop } from '../world/GraveyardBackdrop.js';
import { createGroundSurface } from '../world/GroundSurface.js';

const FRAME_INTERVAL_MS = 400;
const FINAL_FRAME_INTERVAL_MS = 640;
const AWAKENING_FRAME_TIMELINE = Object.freeze([
  ['dormant', 0],
  ['shadowStir', FRAME_INTERVAL_MS],
  ['beginRise', FRAME_INTERVAL_MS * 2],
  ['firstRise', FRAME_INTERVAL_MS * 3],
  ['halfSettle', FRAME_INTERVAL_MS * 4],
  ['secondRise', FRAME_INTERVAL_MS * 5],
  ['fullStance', FRAME_INTERVAL_MS * 6],
  ['settle', FRAME_INTERVAL_MS * 7],
  ['headLifting', FRAME_INTERVAL_MS * 8],
  ['headUp', FRAME_INTERVAL_MS * 9],
  ['eyesAwaken', FRAME_INTERVAL_MS * 9 + FINAL_FRAME_INTERVAL_MS],
  ['lifeforceSurge', FRAME_INTERVAL_MS * 9 + FINAL_FRAME_INTERVAL_MS * 2],
  ['conscious', FRAME_INTERVAL_MS * 9 + FINAL_FRAME_INTERVAL_MS * 3],
]);

const FAR_FADE_START_MS = 0;
const MID_FADE_START_MS = FRAME_INTERVAL_MS * 4;
const NEAR_FADE_START_MS = FRAME_INTERVAL_MS * 8;
const AWAKENING_TOTAL_MS = FRAME_INTERVAL_MS * 9 + FINAL_FRAME_INTERVAL_MS * 3;
const QUEEN_SPAWN_X = GAME_WIDTH / 2;

export class AwakeningScene extends Phaser.Scene {
  constructor() {
    super('AwakeningScene');
    this.entranceComplete = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');
    const level = createLevel01Runtime();
    this.registry.set('currentLevel', level);
    this.createAwakeningBackdrop(level);

    this.hud = new GameHUD(this);
    this.hud.setHealth(0);
    this.hud.setSpellEnabled(false);
    this.pauseMenu = new PauseMenu(this);

    this.input.keyboard?.on('keydown-ESC', this.togglePause, this);
    this.events.once('shutdown', () => {
      this.input.keyboard?.off('keydown-ESC', this.togglePause, this);
      this.backdrop?.destroy();
      this.groundSurface?.destroy();
      this.hud?.destroy();
    });

    this.runQueenEntrance(level);
  }

  createAwakeningBackdrop(level) {
    this.backdrop = createGraveyardBackdrop(this);
    Object.values(this.backdrop.layers).forEach((layer) => layer.setAlpha(0));
    this.groundSurface = createGroundSurface(this, level.world.width, level.ground.y, level.ground.height);
    this.groundSurface.setAlpha(0);

    this.tweens.add({
      targets: this.backdrop.layers.far,
      alpha: 1,
      delay: FAR_FADE_START_MS,
      duration: MID_FADE_START_MS,
      ease: 'Sine.out',
    });
    this.tweens.add({
      targets: this.backdrop.layers.mid,
      alpha: 1,
      delay: MID_FADE_START_MS,
      duration: NEAR_FADE_START_MS - MID_FADE_START_MS,
      ease: 'Sine.inOut',
    });
    this.tweens.add({
      targets: [this.backdrop.layers.near, this.groundSurface],
      alpha: 1,
      delay: NEAR_FADE_START_MS,
      duration: AWAKENING_TOTAL_MS - NEAR_FADE_START_MS,
      ease: 'Sine.inOut',
    });
  }

  createQueenSprite(level) {
    this.queen = ArabellaAwakeningSprite.create(this, QUEEN_SPAWN_X, level.ground.y);
  }

  runQueenEntrance(level) {
    this.createQueenSprite(level);
    this.queen.setAlpha(0);
    this.queen.setDepth(20);
    this.queen.setVisible(true);
    this.tweens.add({ targets: this.queen, alpha: 1, duration: 300, ease: 'Sine.out' });
    this.runArtworkAwakening();
  }

  runArtworkAwakening() {
    for (const [frameName, delay] of AWAKENING_FRAME_TIMELINE) {
      this.time.delayedCall(delay, () => {
        if (!this.queen?.active || !this.scene.isActive('AwakeningScene')) return;
        this.queen.setArtworkFrame(frameName);
        if (frameName === 'eyesAwaken') this.createLunarCharge();
        if (frameName === 'conscious') this.finishAwakening();
      });
    }
  }

  createLunarCharge() {
    const chargeText = this.add.text(GAME_WIDTH / 2, 103, QUEEN.entrance.lifeforceLabel, {
      color: '#c9aacd', fontFamily: 'monospace', fontSize: '4px', letterSpacing: 1,
    }).setOrigin(0.5).setAlpha(0).setDepth(100);

    this.tweens.add({ targets: chargeText, alpha: 1, duration: 180 });
    this.time.delayedCall(180, () => {
      if (!this.scene.isActive('AwakeningScene') || !this.queen?.active) return;
      this.hud.flickerHealth();
      this.hud.setHealth(1);
      this.queen.setLunarCharge(true);

      const charge = this.add.circle(this.queen.x, this.queen.y - 58, 14, 0xb99bd0, 0.08)
        .setStrokeStyle(1, 0xe8d7ef, 0.8).setDepth(80);
      this.tweens.add({
        targets: charge,
        scale: 1.7,
        alpha: 0,
        duration: 1050,
        ease: 'Cubic.out',
        onComplete: () => charge.destroy(),
      });
    });
  }

  finishAwakening() {
    if (!this.scene.isActive('AwakeningScene') || !this.queen?.active) return;
    this.queen.setArtworkFrame('conscious');
    this.queen.setLunarCharge(false);
    this.hud.setSpellEnabled(true);
    this.entranceComplete = true;
    this.time.delayedCall(220, () => {
      if (this.scene.isActive('AwakeningScene')) this.scene.start('GameScene');
    });
  }

  togglePause() {
    if (!this.entranceComplete) return;
    this.pauseMenu.toggle();
  }
}
