import { GAME_HEIGHT, GAME_WIDTH } from '../config/gameConfig.js';
import { LEVEL_01_BACKGROUND_LAYERS } from '../data/level01Backgrounds.js';

const BACKDROP_WIDTH = 3200;

function createLayer(scene, definition) {
  const layer = scene.add.tileSprite(
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2,
    BACKDROP_WIDTH,
    GAME_HEIGHT,
    definition.key,
  );

  layer.setOrigin(0.5, 0.5);
  layer.setDepth(definition.depth);
  layer.setScrollFactor(definition.scrollFactor, 1);

  const source = layer.texture.getSourceImage();
  const scale = GAME_HEIGHT / source.height;
  layer.setTileScale(scale, scale);

  return layer;
}

export function createGraveyardBackdrop(scene) {
  const layers = {
    far: createLayer(scene, { ...LEVEL_01_BACKGROUND_LAYERS.far, depth: 0 }),
    mid: createLayer(scene, { ...LEVEL_01_BACKGROUND_LAYERS.mid, depth: 1 }),
    near: createLayer(scene, { ...LEVEL_01_BACKGROUND_LAYERS.near, depth: 2 }),
  };

  return {
    layers,
    destroy() {
      Object.values(layers).forEach((layer) => layer.destroy());
    },
  };
}
