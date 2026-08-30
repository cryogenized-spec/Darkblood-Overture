import Phaser from 'phaser';
import { showCinematicArt, hideCinematicArt } from '../ui/cinematicArtOverlay.js';

const DEV_SPLASH_PATH = `${import.meta.env.BASE_URL}assets/ui/dev-splash/obsidian-moon-studio-splash.png`;

export class DevSplashScene extends Phaser.Scene {
  constructor() {
    super('DevSplashScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');
    showCinematicArt(DEV_SPLASH_PATH, 'Obsidian Moon Studio');

    this.time.delayedCall(2200, () => {
      this.scene.start('TitleScene');
    });

    this.events.once('shutdown', hideCinematicArt);
  }
}
