import Phaser from 'phaser';
import { showCinematicArt, hideCinematicArt } from '../ui/cinematicArtOverlay.js';
import { createTitlePrompt, hideTitlePrompt } from '../ui/titlePrompt.js';
import { fadeToDarkness } from '../ui/darknessVeil.js';

const TITLE_ART_PATH = `${import.meta.env.BASE_URL}assets/ui/title-screen/darkblood-overture-title.png`;

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
    this.acceptingInput = false;
    this.transitionStarted = false;
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
    if (!this.acceptingInput || this.transitionStarted) return;
    this.acceptingInput = false;
    this.transitionStarted = true;
    hideTitlePrompt();

    // Push the screen out through three increasing stages of darkness. Once
    // fully black, hand over to the awakening cinematic.
    fadeToDarkness().then(() => {
      if (!this.scene.isActive('TitleScene')) return;
      hideCinematicArt();
      this.scene.start('AwakeningScene');
    });
  }
}
