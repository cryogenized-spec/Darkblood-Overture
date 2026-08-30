import Phaser from 'phaser';
import {
  ARABELLA_RUN_DISPLAY_HEIGHT,
  ARABELLA_RUN_FRAMES,
  ARABELLA_RUN_TEXTURE_KEYS,
} from '../data/arabellaRunFrames.js';

const LEFT_SEQUENCE = ['contactLeft', 'downLeft', 'passingLeft', 'upLeft', 'transitionLeft', 'settleLeft'];
const RIGHT_SEQUENCE = ['contactRight', 'downRight', 'passingRight', 'upRight', 'transitionRight', 'settleRight'];
const RUN_FRAME_MS = 90;

export class ArabellaRunSprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    const textureKey = ARABELLA_RUN_TEXTURE_KEYS.contactRight;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Arabella run texture '${textureKey}' was not loaded before GameScene.`);
    }

    super(scene, x, y, textureKey);
    scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(20);
    this.setVisible(true);
    this.baseHeight = ARABELLA_RUN_DISPLAY_HEIGHT;
    this.facing = 'right';
    this.running = false;
    this.sequenceIndex = 0;
    this.frameTimer = 0;
    this.applyFrameScale();
  }

  setFacing(direction) {
    this.facing = direction === 'left' ? 'left' : 'right';
  }

  startRun() {
    this.running = true;
  }

  stopRun() {
    if (!this.running) return;
    this.running = false;
    this.sequenceIndex = 0;
    this.frameTimer = 0;
    this.frame(this.facing === 'left' ? 'contactLeft' : 'contactRight');
  }

  updateRun(deltaMs) {
    if (!this.running) return;
    this.frameTimer += deltaMs;
    while (this.frameTimer >= RUN_FRAME_MS) {
      this.frameTimer -= RUN_FRAME_MS;
      const sequence = this.facing === 'left' ? LEFT_SEQUENCE : RIGHT_SEQUENCE;
      this.sequenceIndex = (this.sequenceIndex + 1) % sequence.length;
      this.frame(sequence[this.sequenceIndex]);
    }
  }

  frame(name) {
    if (!ARABELLA_RUN_FRAMES.some((entry) => entry.name === name)) return;
    const textureKey = ARABELLA_RUN_TEXTURE_KEYS[name];
    if (!this.scene.textures.exists(textureKey)) {
      throw new Error(`Arabella run texture '${name}' is missing.`);
    }

    this.setTexture(textureKey);
    this.applyFrameScale();
  }

  applyFrameScale() {
    const source = this.texture.getSourceImage();
    if (!source || source.height <= 0) {
      throw new Error('Arabella run texture has invalid source dimensions.');
    }

    this.setScale(this.baseHeight / source.height);
  }
}
