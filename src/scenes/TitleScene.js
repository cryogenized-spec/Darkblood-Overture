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

    // Use three deliberate darkness stages instead of a single abrupt fade. This
    // gives the first awakening frame a clean, fully-black stage to arrive on.
    const darkness = this.add.rectangle(400, 225, 800, 450, 0x000000, 0)
      .setScrollFactor(0)
      .setDepth(1000);
    this.tweens.chain({
      targets: darkness,
      tweens: [
        { alpha: 0.34, duration: 300, ease: 'Sine.inOut' },
        { alpha: 0.68, duration: 300, ease: 'Sine.inOut' },
        { alpha: 1, duration: 300, ease: 'Sine.inOut' },
      ],
      onComplete: () => this.scene.start('AwakeningScene'),
    });
  }
}
