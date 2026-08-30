import Phaser from 'phaser';
import './styles.css';
import { BootScene } from './scenes/BootScene.js';
import { DevSplashScene } from './scenes/DevSplashScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { AwakeningScene } from './scenes/AwakeningScene.js';
import { GAME_WIDTH, GAME_HEIGHT } from './config/gameConfig.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#050507',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [BootScene, DevSplashScene, TitleScene, MainMenuScene, GameScene, AwakeningScene],
  input: {
    activePointers: 3,
  },
};

let game = null;
let gameStarted = false;

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  game = new Phaser.Game(config);
  window.darkbloodGame = game;
}

window.addEventListener('darkblood:orientation-ready', startGame, { once: true });

// Handles cases where the orientation bootstrap has already acknowledged before
// this module evaluated.
if (window.darkbloodOrientationReady === true) startGame();
