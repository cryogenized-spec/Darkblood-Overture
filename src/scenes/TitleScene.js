import Phaser from 'phaser';
import { showCinematicArt, hideCinematicArt } from '../ui/cinematicArtOverlay.js';
import { createTitlePrompt, hideTitlePrompt } from '../ui/titlePrompt.js';

const TITLE_ART_PATH = `${import.meta.env.BASE_URL}assets/ui/title-screen/darkblood-overture-title.png`;

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.acceptingInput = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#08070b');
    showCinematicArt(TITLE_ART_PATH, 'Darkblood: Overture title screen');

    createTitlePrompt();
    this.input.keyboard?.on('keydown', this.handleInput, this);
    this.input.on('pointerdown', this.handleInput, this);
    this.acceptingInput = true;

    this.events.once('shutdown', () => {
      hideTitlePrompt();
      hideCinematicArt();
      this.input.keyboard?.off('keydown', this.handleInput, this);
      this.input.off('pointerdown', this.handleInput, this);
    });
  }

  handleInput() {
    if (!this.acceptingInput) return;
    this.acceptingInput = false;
    hideTitlePrompt();

    this.cameras.main.fadeOut(900, 0, 0, 0, (_camera, progress) => {
      if (progress >= 1) this.scene.start('AwakeningScene');
    });
  }
}
