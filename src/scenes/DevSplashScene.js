import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

const DEV_SPLASH_KEY = 'dev-splash-art';

export class DevSplashScene extends Phaser.Scene {
  constructor() {
    super('DevSplashScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#050507');

    const image = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, DEV_SPLASH_KEY)
      .setOrigin(0.5)
      .setDepth(1);

    this.fitImageToViewport(image);

    this.time.delayedCall(2200, () => {
      this.scene.start('TitleScene');
    });
  }

  fitImageToViewport(image) {
    const texture = image.texture.getSourceImage();
    if (!texture?.width || !texture?.height) return;

    const scale = Math.min(GAME_WIDTH / texture.width, GAME_HEIGHT / texture.height);
    image.setScale(scale);
  }
}
