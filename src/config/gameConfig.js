export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 180;

export const GAME_TITLE = 'Darkblood: Overture';
export const GAME_TITLE_KATAKANA = 'ダークブラッド：オーバーチュア';
export const STUDIO_NAME = 'Obsidian Moon Studio';

// Content placeholders: these are deliberately data-driven so artwork and copy
// can be replaced later without rewriting the scene flow.
export const SCREEN_CONTENT = {
  devSplash: {
    studio: STUDIO_NAME,
    subline: 'DEVELOPMENT PLACEHOLDER',
  },
  title: {
    title: GAME_TITLE,
    japanese: GAME_TITLE_KATAKANA,
    prompt: 'PRESS ANY KEY',
  },
};

export const GAME_CONFIG = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#050507',
  pixelArt: true,
  roundPixels: true,
};
