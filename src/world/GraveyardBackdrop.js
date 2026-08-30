import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

const LAYER_SPEEDS = Object.freeze({
  far: 0.12,
  mid: 0.36,
  near: 0.72,
});

function drawRepeated(layer, drawMotif) {
  for (let offset = 0; offset < GAME_WIDTH * 3; offset += GAME_WIDTH) {
    drawMotif(layer, offset);
  }
}

function drawFar(layer) {
  layer.fillStyle(0x0b0911, 1);
  layer.fillRect(0, 0, GAME_WIDTH * 3, GAME_HEIGHT);
  layer.fillStyle(0x171320, 1);
  drawRepeated(layer, (g, x) => {
    g.fillTriangle(x + 8, 72, x + 48, 35, x + 92, 72);
    g.fillTriangle(x + 78, 72, x + 118, 28, x + 165, 72);
    g.fillRect(x + 106, 52, 4, 20);
    g.fillRect(x + 134, 47, 4, 25);
    g.fillRect(x + 148, 42, 4, 30);
  });
  layer.fillStyle(0x241d2d, 1);
  layer.fillRect(0, 72, GAME_WIDTH * 3, 28);
  layer.fillStyle(0x3a2d43, 0.35);
  layer.fillCircle(255, 34, 20);
}

function drawMid(layer) {
  layer.fillStyle(0x09080d, 1);
  layer.fillRect(0, 92, GAME_WIDTH * 3, 88);
  layer.fillStyle(0x211827, 1);
  drawRepeated(layer, (g, x) => {
    g.fillRect(x + 18, 84, 8, 40);
    g.fillTriangle(x + 14, 84, x + 22, 70, x + 30, 84);
    g.fillRect(x + 68, 96, 12, 28);
    g.fillRect(x + 72, 86, 4, 10);
    g.fillRect(x + 122, 88, 5, 36);
    g.fillRect(x + 152, 78, 7, 46);
    g.fillTriangle(x + 148, 78, x + 155, 66, x + 162, 78);
  });
  layer.fillStyle(0x302338, 1);
  layer.fillRect(0, 124, GAME_WIDTH * 3, 6);
}

function drawNear(layer) {
  layer.fillStyle(0x0c0910, 1);
  layer.fillRect(0, 128, GAME_WIDTH * 3, 52);
  layer.fillStyle(0x18131d, 1);
  drawRepeated(layer, (g, x) => {
    g.fillRect(x + 10, 118, 4, 22);
    g.fillRect(x + 7, 116, 10, 3);
    g.fillRect(x + 45, 126, 3, 18);
    g.fillRect(x + 41, 124, 11, 3);
    g.fillRect(x + 96, 116, 5, 25);
    g.fillRect(x + 92, 114, 13, 3);
    g.fillRect(x + 176, 122, 4, 24);
    g.fillRect(x + 172, 120, 12, 3);
  });
  layer.fillStyle(0x28202d, 1);
  layer.fillRect(0, 142, GAME_WIDTH * 3, 4);
}

export function createGraveyardBackdrop(scene) {
  const layers = {
    far: scene.add.graphics().setDepth(0),
    mid: scene.add.graphics().setDepth(1),
    near: scene.add.graphics().setDepth(2),
  };

  drawFar(layers.far);
  drawMid(layers.mid);
  drawNear(layers.near);

  const originX = scene.player?.x ?? GAME_WIDTH / 2;

  return {
    layers,
    originX,
    update(playerX) {
      const displacement = playerX - originX;
      layers.far.x = -displacement * LAYER_SPEEDS.far;
      layers.mid.x = -displacement * LAYER_SPEEDS.mid;
      layers.near.x = -displacement * LAYER_SPEEDS.near;
    },
    destroy() {
      Object.values(layers).forEach((layer) => layer.destroy());
    },
  };
}
