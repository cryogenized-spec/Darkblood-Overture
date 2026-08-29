import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCREEN_CONTENT } from '../config/gameConfig.js';
import { createTitlePrompt, hideTitlePrompt } from '../ui/titlePrompt.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.acceptingInput = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#08070b');

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 12, GAME_HEIGHT - 12)
      .setStrokeStyle(1, 0x6c5b77, 0.55);

    this.add.text(GAME_WIDTH / 2, 57, 'DARKBLOOD:', {
      color: '#f4f0e7', fontFamily: 'Georgia, serif', fontSize: '26px', fontStyle: 'bold', letterSpacing: 3,
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 84, 'OVERTURE', {
      color: '#d7c6df', fontFamily: 'Georgia, serif', fontSize: '14px', letterSpacing: 7,
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 105, SCREEN_CONTENT.title.japanese, {
      color: '#a991b6', fontFamily: 'sans-serif', fontSize: '7px', letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 126, '[ TITLE ART PLACEHOLDER ]', {
      color: '#514957', fontFamily: 'monospace', fontSize: '5px', letterSpacing: 1,
    }).setOrigin(0.5);

    createTitlePrompt(SCREEN_CONTENT.title.prompt);
    this.input.keyboard?.on('keydown', this.handleInput, this);
    this.input.on('pointerdown', this.handleInput, this);
    this.acceptingInput = true;

    this.events.once('shutdown', () => {
      hideTitlePrompt();
      this.input.keyboard?.off('keydown', this.handleInput, this);
      this.input.off('pointerdown', this.handleInput, this);
    });
  }

  handleInput() {
    if (!this.acceptingInput) return;
    this.acceptingInput = false;
    hideTitlePrompt();

    const cam = this.cameras.main;
    cam.fadeOut(160, 0, 0, 0);
    this.time.delayedCall(230, () => cam.fadeIn(160, 0, 0, 0));
    this.time.delayedCall(600, () => cam.fadeOut(180, 0, 0, 0));
    this.time.delayedCall(860, () => cam.fadeIn(180, 0, 0, 0));
    this.time.delayedCall(1160, () => cam.fadeOut(520, 0, 0, 0));
    this.time.delayedCall(1720, () => this.scene.start('AwakeningScene'));
  }
}
