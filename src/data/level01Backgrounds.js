import { GAME_HEIGHT } from '../config/gameConfig.js';

export const LEVEL_01_BACKGROUND_HEIGHT = GAME_HEIGHT;

export const LEVEL_01_BACKGROUND_LAYERS = Object.freeze({
  far: {
    key: 'level01-background-far',
    file: 'level01-far.png',
    scrollFactor: 0.12,
  },
  mid: {
    key: 'level01-background-mid',
    file: 'level01-mid.png',
    scrollFactor: 0.36,
  },
  near: {
    key: 'level01-background-near',
    file: 'level01-near.png',
    scrollFactor: 0.72,
  },
});

export const LEVEL_01_BACKGROUND_PATH = `${import.meta.env.BASE_URL}assets/backgrounds/level01/`;
