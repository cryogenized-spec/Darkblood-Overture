import Phaser from 'phaser';
import {
  ARABELLA_AWAKENING_FRAMES,
  ARABELLA_SPRITE_PATH,
  ARABELLA_TEXTURE_KEYS,
} from '../data/arabellaAwakeningFrames.js';
import {
  ARABELLA_IDLE_FRAMES,
  ARABELLA_IDLE_SPRITE_PATH,
  ARABELLA_IDLE_TEXTURE_KEYS,
} from '../data/arabellaIdleFrames.js';
import {
  ARABELLA_RUN_FRAMES,
  ARABELLA_RUN_SPRITE_PATH,
  ARABELLA_RUN_TEXTURE_KEYS,
} from '../data/arabellaRunFrames.js';
import {
  DARK_BOLT_CAST_FRAMES,
  DARK_BOLT_CAST_SPRITE_PATH,
  DARK_BOLT_CAST_TEXTURE_KEYS,
  DARK_BOLT_PROJECTILE_FRAMES,
  DARK_BOLT_PROJECTILE_SPRITE_PATH,
  DARK_BOLT_PROJECTILE_TEXTURE_KEYS,
} from '../data/darkBoltFrames.js';

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

    ARABELLA_IDLE_FRAMES.forEach(({ name, file }) => {
      this.load.image(ARABELLA_IDLE_TEXTURE_KEYS[name], `${ARABELLA_IDLE_SPRITE_PATH}${file}`);
    });

    ARABELLA_RUN_FRAMES.forEach(({ name, file }) => {
      this.load.image(ARABELLA_RUN_TEXTURE_KEYS[name], `${ARABELLA_RUN_SPRITE_PATH}${file}`);
    });

    DARK_BOLT_CAST_FRAMES.forEach(({ name, file }) => {
      this.load.image(DARK_BOLT_CAST_TEXTURE_KEYS[name], `${DARK_BOLT_CAST_SPRITE_PATH}${file}`);
    });

    DARK_BOLT_PROJECTILE_FRAMES.forEach(({ name, file }) => {
      this.load.image(
        DARK_BOLT_PROJECTILE_TEXTURE_KEYS[name],
        `${DARK_BOLT_PROJECTILE_SPRITE_PATH}${file}`,
      );
    });
  }

  create() {
    [
      ...ARABELLA_AWAKENING_FRAMES.map(({ name }) => ARABELLA_TEXTURE_KEYS[name]),
      ...ARABELLA_IDLE_FRAMES.map(({ name }) => ARABELLA_IDLE_TEXTURE_KEYS[name]),
      ...ARABELLA_RUN_FRAMES.map(({ name }) => ARABELLA_RUN_TEXTURE_KEYS[name]),
      ...DARK_BOLT_CAST_FRAMES.map(({ name }) => DARK_BOLT_CAST_TEXTURE_KEYS[name]),
      ...DARK_BOLT_PROJECTILE_FRAMES.map(({ name }) => DARK_BOLT_PROJECTILE_TEXTURE_KEYS[name]),
    ].forEach((textureKey) => {
      const texture = this.textures.get(textureKey);
      if (!texture) throw new Error(`Missing loaded texture '${textureKey}'.`);
      const source = texture.getSourceImage();
      if (!source || source.width <= 0 || source.height <= 0) {
        throw new Error(`Texture '${textureKey}' has invalid source dimensions.`);
      }
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    });

    this.scene.start('DevSplashScene');
  }
}
