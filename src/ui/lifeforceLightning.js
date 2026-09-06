// DOM/CSS overlay for the Queen's lifeforce surge: purple lightning rising
// around Arabella while her life bar consolidates. The visual language lives
// entirely in lifeforceLightning.css; this module only places the effect box
// in game coordinates and rolls the strike parameters (position, delay,
// duration, sway) so no two surges read identically.
//
// #game-container is locked to the game's 16:9 aspect, so percentage offsets
// map 1:1 onto game space, and --lfu (one game pixel in CSS pixels) keeps the
// arc glows scaled with the canvas.

import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';
import './lifeforceLightning.css';

const OVERLAY_ID = 'lifeforce-lightning';
const BOLT_COUNT = 7;
const SPARK_COUNT = 14;
const BOX_WIDTH = 64; // game pixels spanned across the Queen
const HEAD_ROOM = 22; // game pixels the arcs climb above her head
const BOLT_VARIANTS = ['a', 'b', 'c'];

let overlay = null;
let resizeObserver = null;
let teardownTimer = 0;

const pctX = (gameX) => (gameX / GAME_WIDTH) * 100;
const pctY = (gameY) => (gameY / GAME_HEIGHT) * 100;
const rand = (min, max) => min + Math.random() * (max - min);

export function showLifeforceLightning({ x, groundY, height, durationMs }) {
  hideLifeforceLightning();

  const container = document.getElementById('game-container');
  if (!container) return null;

  overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('aria-hidden', 'true');

  const topY = groundY - height - HEAD_ROOM;
  const bottomY = groundY + 2;
  overlay.style.left = `${pctX(x - BOX_WIDTH / 2)}%`;
  overlay.style.width = `${pctX(BOX_WIDTH)}%`;
  overlay.style.top = `${pctY(topY)}%`;
  overlay.style.height = `${pctY(bottomY - topY)}%`;
  overlay.style.setProperty('--lf-duration', `${Math.round(durationMs)}ms`);
  container.appendChild(overlay);

  const syncUnit = () => {
    overlay?.style.setProperty('--lfu', `${container.clientWidth / GAME_WIDTH}px`);
  };
  syncUnit();
  resizeObserver = new ResizeObserver(syncUnit);
  resizeObserver.observe(container);

  const aura = document.createElement('div');
  aura.className = 'lf-aura';
  overlay.appendChild(aura);

  for (let i = 0; i < BOLT_COUNT; i += 1) {
    const wrap = document.createElement('div');
    wrap.className = 'lf-bolt-wrap';
    wrap.style.left = `${rand(4, 88).toFixed(1)}%`;
    wrap.style.setProperty('--lf-delay', `${Math.round(rand(0, durationMs * 0.42))}ms`);
    wrap.style.setProperty('--lf-jitter', `calc(var(--lfu) * ${rand(0.4, 1.1).toFixed(2)})`);

    const bolt = document.createElement('div');
    bolt.className = `lf-bolt lf-bolt--${BOLT_VARIANTS[i % BOLT_VARIANTS.length]}`;
    bolt.style.height = `${Math.round(rand(48, 94))}%`;
    bolt.style.setProperty('--lf-bolt-dur', `${Math.round(rand(430, 760))}ms`);
    bolt.style.setProperty('--lf-sway', `calc(var(--lfu) * ${rand(-1.6, 1.6).toFixed(2)})`);
    wrap.appendChild(bolt);
    overlay.appendChild(wrap);
  }

  for (let i = 0; i < SPARK_COUNT; i += 1) {
    const spark = document.createElement('div');
    spark.className = 'lf-spark';
    spark.style.left = `${rand(2, 96).toFixed(1)}%`;
    spark.style.setProperty('--lf-delay', `${Math.round(rand(0, durationMs * 0.55))}ms`);
    spark.style.setProperty('--lf-spark-dur', `${Math.round(rand(620, 1100))}ms`);
    spark.style.setProperty('--lf-spark-rise', `calc(var(--lfu) * ${rand(-92, -46).toFixed(1)})`);
    spark.style.setProperty('--lf-spark-sway', `calc(var(--lfu) * ${rand(-4, 4).toFixed(1)})`);
    overlay.appendChild(spark);
  }

  teardownTimer = window.setTimeout(hideLifeforceLightning, durationMs + 500);
  return overlay;
}

export function hideLifeforceLightning() {
  window.clearTimeout(teardownTimer);
  teardownTimer = 0;
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}
