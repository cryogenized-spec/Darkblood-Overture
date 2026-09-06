import Phaser from 'phaser';
import { GAME_WIDTH } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';
import { QUEEN } from '../data/queen.js';
import {
  ARABELLA_AWAKENING_FRAMES,
  ARABELLA_TEXTURE_KEYS,
} from '../data/arabellaAwakeningFrames.js';
import { clearDarkness } from '../ui/darknessVeil.js';
import { ArabellaAwakeningSprite } from '../entities/ArabellaAwakeningSprite.js';
import { GameHUD } from '../ui/GameHUD.js';
import { PauseMenu } from '../ui/PauseMenu.js';
import { createGraveyardBackdrop } from '../world/GraveyardBackdrop.js';
import { createGroundSurface } from '../world/GroundSurface.js';

// Cinematic timing (ms). The rise is deliberately a little slower than the old
// hard-cut version and each keyframe dissolves into the next so it reads fluid.
const QUEEN_FADE_IN_MS = 600;
const RISE_FRAME_MS = 440;
const RISE_FINAL_FRAME_MS = 680;
const RISE_CROSSFADE_MS = 120;
const BRIGHTEN_STAGE_MS = 440;
const BRIGHTEN_DELAY_MS = 200;
const END_BEAT_MS = 240;

// Indices 1..LAST_REGULAR_INDEX advance on the regular interval; the final
// three frames (eyesAwaken, lifeforceSurge, conscious) land more deliberately.
const LAST_REGULAR_INDEX = 9;
const QUEEN_SPAWN_X = GAME_WIDTH / 2;

export class AwakeningScene extends Phaser.Scene {
  constructor() {
    super('AwakeningScene');
    this.entranceComplete = false;
  }

  create() {
    // The title screen hands over fully black; drop the veil so the awakening
    // canvas (also dark) takes over with no flash.
    clearDarkness();

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
  }

  createQueenSprite(level) {
    this.queen = ArabellaAwakeningSprite.create(this, QUEEN_SPAWN_X, level.ground.y);
  }

  runQueenEntrance(level) {
    this.createQueenSprite(level);
    this.queen.setAlpha(0);
    this.queen.setDepth(20);
    this.queen.setVisible(true);

    // The dormant sprite is the first thing to reveal against the dark.
    this.tweens.add({ targets: this.queen, alpha: 1, duration: QUEEN_FADE_IN_MS, ease: 'Sine.out' });

    this.runRiseSequence();
  }

  runRiseSequence() {
    const frameNames = ARABELLA_AWAKENING_FRAMES.map((entry) => entry.name);
    let cursor = QUEEN_FADE_IN_MS;

    for (let i = 1; i < frameNames.length; i += 1) {
      const interval = i > LAST_REGULAR_INDEX ? RISE_FINAL_FRAME_MS : RISE_FRAME_MS;
      cursor += interval;
      const at = cursor;
      const name = frameNames[i];

      this.time.delayedCall(at, () => {
        if (!this.queen?.active || !this.scene.isActive('AwakeningScene')) return;
        this.crossfadeToFrame(name);
        if (name === 'eyesAwaken') this.createLunarCharge();
      });
    }

    // Once the final frame has dissolved in and she's fully upright, fade the
    // world in through three stages of brightness, then let the stage begin.
    this.time.delayedCall(cursor + RISE_CROSSFADE_MS, () => {
      if (this.scene.isActive('AwakeningScene')) this.finishAwakening();
    });
  }

  crossfadeToFrame(name) {
    const ghost = this.add.sprite(this.queen.x, this.queen.y, ARABELLA_TEXTURE_KEYS[name]);
    ghost.setOrigin(0.5, 1);
    ghost.setDepth(this.queen.depth + 1);
    ghost.setScrollFactor(0);
    ghost.setScale(this.queen.awakeningScale);
    ghost.setAlpha(0);
    const tint = typeof this.queen.tintTopLeft === 'number' ? this.queen.tintTopLeft : 0xffffff;
    ghost.setTint(tint);

    this.tweens.add({
      targets: ghost,
      alpha: this.queen.alpha,
      duration: RISE_CROSSFADE_MS,
      ease: 'Sine.inOut',
      onComplete: () => {
        if (!ghost.active) return;
        this.queen.setArtworkFrame(name);
        ghost.destroy();
      },
    });
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

    this.brightenBackdrop(() => {
      this.time.delayedCall(END_BEAT_MS, () => {
        if (this.scene.isActive('AwakeningScene')) this.scene.start('GameScene');
      });
    });
  }

  brightenBackdrop(onComplete) {
    // Two hundred milliseconds of daylight between each brightening stage. The
    // three parallax layers serve as the three stages: far, then mid, then near.
    const stageDelay = BRIGHTEN_STAGE_MS + BRIGHTEN_DELAY_MS;
    const stages = [
      { targets: this.backdrop.layers.far, delay: 0 },
      { targets: this.backdrop.layers.mid, delay: stageDelay },
      { targets: [this.backdrop.layers.near, this.groundSurface], delay: stageDelay * 2 },
    ];
    stages.forEach(({ targets, delay }) => {
      this.tweens.add({
        targets,
        alpha: 1,
        duration: BRIGHTEN_STAGE_MS,
        ease: 'Sine.inOut',
        delay,
      });
    });
    this.time.delayedCall(stageDelay * 2 + BRIGHTEN_STAGE_MS, onComplete);
  }

  togglePause() {
    if (!this.entranceComplete) return;
    this.pauseMenu.toggle();
  }
}
