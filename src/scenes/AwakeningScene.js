import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { createLevel01Runtime } from '../data/level01.js';
import { QUEEN } from '../data/queen.js';
import { ArabellaAwakeningSprite } from '../entities/ArabellaAwakeningSprite.js';
import { GameHUD } from '../ui/GameHUD.js';
import { PauseMenu } from '../ui/PauseMenu.js';

export class AwakeningScene extends Phaser.Scene {
  constructor() {
    super('AwakeningScene');
    this.entranceComplete = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');
    this.registry.set('currentLevel', createLevel01Runtime());
    this.createWorldPlaceholder();

    this.hud = new GameHUD(this);
    this.hud.setHealth(0);
    this.hud.setSpellEnabled(false);
    this.pauseMenu = new PauseMenu(this);

    this.input.keyboard?.on('keydown-ESC', this.togglePause, this);
    this.events.once('shutdown', () => {
      this.input.keyboard?.off('keydown-ESC', this.togglePause, this);
      this.hud?.destroy();
    });

    this.runQueenEntrance();
  }

  createWorldPlaceholder() {
    this.add.rectangle(GAME_WIDTH / 2, 137, GAME_WIDTH, 86, 0x0a0810, 1).setDepth(0);
    this.add.circle(255, 42, 23, 0x6d5a82, 0.22).setDepth(0);
    this.add.circle(255, 42, 18, 0xb9a9c7, 0.15).setDepth(0);
    this.add.text(GAME_WIDTH / 2, 165, 'LEVEL 01  •  GRAVEYARD', {
      color: '#382f3c', fontFamily: 'monospace', fontSize: '4px', letterSpacing: 1,
    }).setOrigin(0.5).setDepth(1);
  }

  createQueenSprite() {
    this.queen = new ArabellaAwakeningSprite(this, GAME_WIDTH / 2, 170);
  }

  runQueenEntrance() {
    this.createQueenSprite();
    this.queen.setAlpha(0);
    const black = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 1).setDepth(900);

    this.tweens.add({ targets: black, alpha: 0, duration: 420, ease: 'Sine.out' });
    this.time.delayedCall(560, () => this.tweens.add({ targets: black, alpha: 1, duration: 220, ease: 'Sine.inOut' }));
    this.time.delayedCall(900, () => this.tweens.add({ targets: black, alpha: 0, duration: 420, ease: 'Sine.out' }));
    this.time.delayedCall(1480, () => this.tweens.add({ targets: black, alpha: 1, duration: 220, ease: 'Sine.inOut' }));
    this.time.delayedCall(1780, () => this.tweens.add({
      targets: black,
      alpha: 0,
      duration: 300,
      ease: 'Sine.inOut',
      onComplete: () => black.destroy(),
    }));

    this.time.delayedCall(2050, () => {
      this.queen.setDepth(20);
      this.queen.setVisible(true);
      this.tweens.add({ targets: this.queen, alpha: 1, duration: 300, ease: 'Sine.out' });
      this.runArtworkAwakening();
    });
  }

  runArtworkAwakening() {
    this.queen.frame('dormant');
    this.time.delayedCall(320, () => this.queen.frame('shadowStir'));
    this.time.delayedCall(620, () => this.queen.frame('beginRise'));
    this.time.delayedCall(940, () => this.queen.frame('firstRise'));
    this.time.delayedCall(1410, () => this.queen.frame('halfSettle'));
    this.time.delayedCall(1690, () => this.queen.frame('secondRise'));
    this.time.delayedCall(2070, () => this.queen.frame('fullStance'));
    this.time.delayedCall(2470, () => this.queen.frame('settle'));
    this.time.delayedCall(2840, () => this.queen.frame('headLifting'));
    this.time.delayedCall(3160, () => this.queen.frame('headUp'));
    this.time.delayedCall(3490, () => {
      this.queen.frame('eyesAwaken');
      this.createLunarCharge();
    });
  }

  createLunarCharge() {
    const chargeText = this.add.text(GAME_WIDTH / 2, 103, QUEEN.entrance.lifeforceLabel, {
      color: '#c9aacd', fontFamily: 'monospace', fontSize: '4px', letterSpacing: 1,
    }).setOrigin(0.5).setAlpha(0).setDepth(100);

    this.tweens.add({ targets: chargeText, alpha: 1, duration: 180 });
    this.time.delayedCall(180, () => {
      this.hud.flickerHealth();
      this.hud.setHealth(1);
      this.queen.setLunarCharge(true);

      const charge = this.add.circle(this.queen.x, this.queen.y - 80, 14, 0xb99bd0, 0.08)
        .setStrokeStyle(1, 0xe8d7ef, 0.8).setDepth(80);
      this.tweens.add({
        targets: charge,
        scale: 1.7,
        alpha: 0,
        duration: 1050,
        ease: 'Cubic.out',
        onComplete: () => charge.destroy(),
      });
      this.time.delayedCall(1050, () => this.finishAwakening(chargeText));
    });
  }

  finishAwakening(chargeText) {
    this.queen.frame('conscious');
    this.queen.setLunarCharge(false);
    this.hud.setSpellEnabled(true);
    this.tweens.add({ targets: chargeText, alpha: 0, duration: 260, onComplete: () => chargeText.destroy() });
    const outline = this.add.circle(this.queen.x, this.queen.y - 80, 34, 0xe8d7ef, 0)
      .setStrokeStyle(2, 0xe8d7ef, 0.95).setDepth(90);
    this.tweens.add({ targets: outline, scale: 1.45, alpha: 0, duration: 430, ease: 'Sine.out', onComplete: () => outline.destroy() });
    this.time.delayedCall(520, () => { this.showActTitle(); this.entranceComplete = true; });
  }

  showActTitle() {
    const act = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ACT I', {
      color: '#f4f0e7', fontFamily: 'serif', fontSize: '13px', fontStyle: 'italic', letterSpacing: 5,
    }).setOrigin(0.5).setDepth(500).setAlpha(0);
    this.tweens.add({ targets: act, alpha: 1, duration: 280, hold: 700, yoyo: true, ease: 'Sine.inOut', onComplete: () => act.destroy() });
    this.time.delayedCall(1500, () => {
      if (this.scene.isActive('AwakeningScene')) this.scene.start('GameScene');
    });
  }

  togglePause() {
    if (!this.entranceComplete) return;
    this.pauseMenu.toggle();
  }
}
