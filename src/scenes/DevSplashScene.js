import Phaser from 'phaser';
import { showCinematicArt, hideCinematicArt } from '../ui/cinematicArtOverlay.js';

const DEV_SPLASH_PATH = `${import.meta.env.BASE_URL}assets/ui/dev-splash/obsidian-moon-studio-splash.png`;
const DEV_SPLASH_DURATION_MS = 2200;

export class DevSplashScene extends Phaser.Scene {
  constructor() {
    super('DevSplashScene');
    this.transitionStarted = false;
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');
    const { ready } = showCinematicArt(DEV_SPLASH_PATH, 'Obsidian Moon Studio');

    ready
      .then(() => {
        if (!this.scene.isActive('DevSplashScene')) return;
        this.time.delayedCall(DEV_SPLASH_DURATION_MS, () => this.advance());
      })
      .catch(() => {
        this.advance();
      });

    this.events.once('shutdown', hideCinematicArt);
  }

  advance() {
    if (this.transitionStarted || !this.scene.isActive('DevSplashScene')) return;
    this.transitionStarted = true;
    this.scene.start('TitleScene');
  }
}
