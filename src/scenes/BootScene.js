import Phaser from 'phaser';
import {
  ARABELLA_AWAKENING_FRAMES,
  ARABELLA_SPRITE_PATH,
  ARABELLA_SPRITE_SIZE,
  ARABELLA_TEXTURE_KEYS,
} from '../data/arabellaAwakeningFrames.js';

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

    ARABELLA_AWAKENING_FRAMES.forEach(({ name, file }) => {
      this.load.image(ARABELLA_TEXTURE_KEYS[name], `${ARABELLA_SPRITE_PATH}${file}`);
    });
  }

  create() {
    ARABELLA_AWAKENING_FRAMES.forEach(({ name }) => {
      const texture = this.textures.get(ARABELLA_TEXTURE_KEYS[name]);
      if (!texture) throw new Error(`Missing loaded Arabella texture '${name}'.`);

      const source = texture.getSourceImage();
      if (source.width !== ARABELLA_SPRITE_SIZE.width || source.height !== ARABELLA_SPRITE_SIZE.height) {
        throw new Error(
          `Arabella frame '${name}' must be ${ARABELLA_SPRITE_SIZE.width}x${ARABELLA_SPRITE_SIZE.height}, got ${source.width}x${source.height}.`,
        );
      }

      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    });

    this.scene.start('DevSplashScene');
  }
}
