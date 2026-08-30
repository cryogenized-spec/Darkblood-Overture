import Phaser from 'phaser';

const DEV_SPLASH_KEY = 'dev-splash-art';
const TITLE_ART_KEY = 'title-screen-art';
const ASSET_BASE = import.meta.env.BASE_URL;

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image(
      DEV_SPLASH_KEY,
      `${ASSET_BASE}assets/ui/dev-splash/obsidian-moon-studio-splash.png`,
    );
    this.load.image(
      TITLE_ART_KEY,
      `${ASSET_BASE}assets/ui/title-screen/darkblood-overture-title.png`,
    );
  }

  create() {
    this.scene.start('DevSplashScene');
  }
}
