import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import { createTitlePrompt, hideTitlePrompt } from '../ui/titlePrompt.js';

const TITLE_ART_KEY = 'title-screen-art';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.acceptingInput = false;
  }

  preload() {
    this.load.image(TITLE_ART_KEY, 'assets/ui/title-screen/darkblood-overture-title.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#08070b');

    const image = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TITLE_ART_KEY)
      .setOrigin(0.5)
      .setDepth(1);

    this.fitImageToViewport(image);

    createTitlePrompt();
    this.input.keyboard?.on('keydown', this.handleInput, this);
    this.input.on('pointerdown', this.handleInput, this);
    this.acceptingInput = true;

    this.events.once('shutdown', () => {
      hideTitlePrompt();
      this.input.keyboard?.off('keydown', this.handleInput, this);
      this.input.off('pointerdown', this.handleInput, this);
    });
  }

  fitImageToViewport(image) {
    const texture = image.texture.getSourceImage();
    if (!texture?.width || !texture?.height) return;

    const scale = Math.max(GAME_WIDTH / texture.width, GAME_HEIGHT / texture.height);
    image.setScale(scale);
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
