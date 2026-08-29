import Phaser from 'phaser';
import { ARABELLA_PALETTE as P } from './palette.js';

export const ARABELLA_FRAME = Object.freeze({
  dormant: 0,
  shadowStir: 1,
  beginRise: 2,
  firstRise: 3,
  halfSettle: 4,
  secondRise: 5,
  fullStance: 6,
  settle: 7,
  headLifting: 8,
  headUp: 9,
  eyesAwaken: 10,
  lifeforceSurge: 11,
  conscious: 12,
});

export const ARABELLA_PIXEL = Object.freeze({ width: 128, height: 160, frameCount: 13 });

function setPixel(data, width, x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= data.length / width / 4) return;
  const index = (y * width + x) * 4;
  data[index] = color[0];
  data[index + 1] = color[1];
  data[index + 2] = color[2];
  data[index + 3] = color[3];
}

function block(data, width, x, y, w, h, color) {
  const startX = Math.floor(x);
  const startY = Math.floor(y);
  const endX = Math.ceil(x + w);
  const endY = Math.ceil(y + h);
  for (let py = startY; py < endY; py += 1) {
    for (let px = startX; px < endX; px += 1) setPixel(data, width, px, py, color);
  }
}

function line(data, width, x0, y0, x1, y1, color, thickness = 1) {
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const steps = Math.max(dx, dy);
  if (!steps) {
    block(data, width, x0, y0, thickness, thickness, color);
    return;
  }
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    block(data, width, Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), thickness, thickness, color);
  }
}

function ellipse(data, width, cx, cy, rx, ry, color) {
  const left = Math.floor(cx - rx);
  const right = Math.ceil(cx + rx);
  const top = Math.floor(cy - ry);
  const bottom = Math.ceil(cy + ry);
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      if (nx * nx + ny * ny <= 1) setPixel(data, width, x, y, color);
    }
  }
}

function hairLocks(data, width, cx, topY, stance, color, highlight) {
  const sway = stance === 'kneel' ? 3 : stance === 'rising' ? 5 : 8;
  const lengths = stance === 'kneel' ? [48, 42, 37, 32, 26] : [76, 69, 62, 56, 48, 40];
  lengths.forEach((length, i) => {
    const side = i % 2 === 0 ? -1 : 1;
    const baseX = cx + side * (10 + Math.floor(i / 2) * 6);
    const endX = baseX + side * (8 + ((i * 3) % sway));
    line(data, width, baseX, topY + 7 + i * 2, endX, topY + length, color, 2);
    if (i < 4) {
      line(data, width, baseX + side * 2, topY + 11 + i * 2, endX + side, topY + length - 7, highlight, 1);
    }
  });
}

function drawHead(data, width, cx, cy, eyesOn, headUp) {
  ellipse(data, width, cx, cy, 12, 14, P.skin);
  block(data, width, cx - 7, cy - 11, 14, 5, P.hair);
  block(data, width, cx - 11, cy - 7, 4, 9, P.hair);
  block(data, width, cx + 8, cy - 7, 4, 9, P.hair);

  line(data, width, cx - 10, cy - 4, cx - 18, cy - 11, P.skinDark, 3);
  line(data, width, cx + 10, cy - 4, cx + 18, cy - 11, P.skinDark, 3);
  line(data, width, cx - 10, cy - 3, cx - 16, cy - 7, P.skinLight, 1);
  line(data, width, cx + 10, cy - 3, cx + 16, cy - 7, P.skinLight, 1);

  const browY = cy - (headUp ? 3 : 1);
  line(data, width, cx - 7, browY, cx - 2, browY - 1, P.hair2, 2);
  line(data, width, cx + 2, browY - 1, cx + 7, browY, P.hair2, 2);

  if (eyesOn) {
    block(data, width, cx - 6, cy + 1, 5, 2, P.azure);
    block(data, width, cx + 1, cy + 1, 5, 2, P.eyeGold);
    block(data, width, cx - 5, cy + 1, 2, 2, P.lunar);
    block(data, width, cx + 2, cy + 1, 2, 2, P.lunar);
  } else {
    line(data, width, cx - 7, cy + 2, cx - 2, cy + 3, P.hair2, 1);
    line(data, width, cx + 2, cy + 3, cx + 7, cy + 2, P.hair2, 1);
  }

  block(data, width, cx - 1, cy + 5, 2, 3, P.skinLight);
  block(data, width, cx - 4, cy + 8, 8, 1, P.lip);
  block(data, width, cx - 4, cy + 9, 8, 1, P.lip);
  block(data, width, cx - 4, cy + 10, 2, 2, P.lunar);
  block(data, width, cx + 2, cy + 10, 2, 2, P.lunar);
}

function drawStaff(data, width, cx, yTop, yBottom, angle = -5) {
  const rad = (angle * Math.PI) / 180;
  const x0 = cx + 22;
  const x1 = x0 + Math.round(Math.sin(rad) * (yBottom - yTop));
  const y1 = yTop;
  line(data, width, x0, yBottom, x1, y1, P.staff, 3);
  line(data, width, x0 - 1, yBottom, x1 - 1, y1, P.staffLight, 1);
  ellipse(data, width, x1, y1 - 6, 7, 8, P.shadow2);
  line(data, width, x1 - 5, y1 - 9, x1, y1 - 15, P.mauve, 2);
  line(data, width, x1 + 5, y1 - 9, x1, y1 - 15, P.mauve, 2);
  block(data, width, x1 - 2, y1 - 17, 4, 5, P.lunar);
}

function drawCloak(data, width, cx, baseY, stance) {
  const spread = stance === 'kneel' ? 18 : stance === 'rising' ? 25 : 30;
  const height = stance === 'kneel' ? 56 : 83;
  ellipse(data, width, cx, baseY - height / 2, spread, height / 2, P.cloth);
  line(data, width, cx - spread + 3, baseY - height + 9, cx - spread + 1, baseY - 2, P.cloth2, 3);
  line(data, width, cx + spread - 3, baseY - height + 9, cx + spread - 1, baseY - 2, P.cloth2, 3);
  for (let i = -2; i <= 2; i += 1) {
    line(data, width, cx + i * 7, baseY - height + 18, cx + i * 9, baseY - 6, i === 0 ? P.mauve : P.shadow2, 1);
  }
}

function drawBody(data, width, cx, baseY, pose) {
  const { torsoY, torsoScale = 1, legSpread = 8, crouched = false } = pose;
  drawCloak(data, width, cx, baseY, crouched ? 'kneel' : 'rising');
  ellipse(data, width, cx, torsoY + 19, 15 * torsoScale, 28 * torsoScale, P.cloth2);
  block(data, width, cx - 7, torsoY + 8, 14, 26, P.cloth);
  line(data, width, cx - 12, torsoY + 14, cx - 19, torsoY + 29, P.skin, 5);
  line(data, width, cx + 12, torsoY + 14, cx + 19, torsoY + 29, P.skin, 5);
  block(data, width, cx - 13, torsoY + 20, 4, 14, P.cloth2);
  block(data, width, cx + 9, torsoY + 20, 4, 14, P.cloth2);
  line(data, width, cx - 12, torsoY + 12, cx - 3, torsoY + 9, P.mauve, 2);
  line(data, width, cx + 3, torsoY + 9, cx + 12, torsoY + 12, P.mauve, 2);
  block(data, width, cx - 3, torsoY + 18, 6, 10, P.lunar);

  if (crouched) {
    ellipse(data, width, cx - 13, baseY - 5, 17, 9, P.cloth2);
    ellipse(data, width, cx + 13, baseY - 5, 17, 9, P.cloth2);
  } else {
    line(data, width, cx - 6, torsoY + 44, cx - legSpread, baseY - 6, P.cloth2, 5);
    line(data, width, cx + 6, torsoY + 44, cx + legSpread, baseY - 6, P.cloth2, 5);
  }
}

function drawPose(data, width, index) {
  const cx = 64;
  const dormant = index <= ARABELLA_FRAME.shadowStir;
  const crouched = index <= ARABELLA_FRAME.halfSettle;
  const rising = index >= ARABELLA_FRAME.beginRise && index <= ARABELLA_FRAME.settle;
  const headUp = index >= ARABELLA_FRAME.headUp;
  const eyesOn = index >= ARABELLA_FRAME.eyesAwaken;

  let headY = 45;
  let torsoY = 62;
  let baseY = 150;
  if (index === ARABELLA_FRAME.dormant) {
    headY = 71;
    torsoY = 92;
    baseY = 146;
  } else if (index === ARABELLA_FRAME.shadowStir) {
    headY = 66;
    torsoY = 86;
    baseY = 147;
  } else if (index === ARABELLA_FRAME.beginRise) {
    headY = 61;
    torsoY = 79;
    baseY = 150;
  } else if (index === ARABELLA_FRAME.firstRise) {
    headY = 54;
    torsoY = 71;
    baseY = 153;
  } else if (index === ARABELLA_FRAME.halfSettle) {
    headY = 57;
    torsoY = 74;
    baseY = 153;
  } else if (index === ARABELLA_FRAME.secondRise) {
    headY = 50;
    torsoY = 66;
    baseY = 153;
  }

  if (!crouched) {
    headY = Math.max(39, Math.min(60, headY));
    torsoY = Math.max(58, Math.min(77, torsoY));
  }

  hairLocks(data, width, cx, headY - 4, crouched ? 'kneel' : rising ? 'rising' : 'standing', dormant ? P.hair : P.hair2, P.violet);
  drawBody(data, width, cx, baseY, {
    torsoY,
    torsoScale: headUp ? 1.04 : 0.98,
    legSpread: 9,
    crouched,
  });
  drawHead(data, width, cx, headY, eyesOn && !dormant, headUp);
  drawStaff(data, width, cx, 40, baseY + 5, index % 3 === 0 ? -7 : -4);

  if (dormant || index === ARABELLA_FRAME.halfSettle) {
    ellipse(data, width, cx, baseY + 2, 30, 7, P.shadow2);
  }

  if (headUp) {
    block(data, width, cx - 2, headY - 17, 4, 3, P.gold);
    block(data, width, cx - 1, headY - 19, 2, 2, P.gold);
  }
}

function createFrame(index) {
  const { width, height } = ARABELLA_PIXEL;
  return new Uint8ClampedArray(
    width * height * 4,
  ).fill(0).map((_, byteIndex, fullData) => {
    if (byteIndex !== 0) return fullData[byteIndex];
    drawPose(fullData, width, index);
    return fullData[byteIndex];
  });
}

export function buildArabellaTexture(scene, key = 'arabella-pixel-awakening') {
  if (scene.textures.exists(key)) return scene.textures.get(key);

  const { width, height, frameCount } = ARABELLA_PIXEL;
  const canvasTexture = scene.textures.createCanvas(key, width * frameCount, height);
  const context = canvasTexture.context;
  context.imageSmoothingEnabled = false;

  for (let frame = 0; frame < frameCount; frame += 1) {
    const image = context.createImageData(width, height);
    image.data.set(createFrame(frame));
    context.putImageData(image, frame * width, 0);
  }

  canvasTexture.refresh();
  canvasTexture.setFilter(Phaser.Textures.FilterMode.NEAREST);

  for (let frame = 0; frame < frameCount; frame += 1) {
    canvasTexture.add(frame, 0, frame * width, 0, width, height);
  }
  return canvasTexture;
}
