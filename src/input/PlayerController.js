import Phaser from 'phaser';

const KEY_TO_DIRECTION = Object.freeze({
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
});
const JUMP_KEYS = new Set(['ArrowUp', 'KeyW', 'KeyX']);

export class PlayerController {
  constructor(scene, speed = 70) {
    this.scene = scene;
    this.speed = speed;
    this.axis = 0;
    this.keys = new Set();
    this.onKeyDown = (event) => {
      const direction = KEY_TO_DIRECTION[event.code];
      if (direction) {
        this.keys.add(direction);
        this.recalculateAxis();
      }
      if (JUMP_KEYS.has(event.code) && !event.repeat) {
        scene.events.emit('darkblood:jump');
      }
    };
    this.onKeyUp = (event) => {
      const direction = KEY_TO_DIRECTION[event.code];
      if (!direction) return;
      this.keys.delete(direction);
      this.recalculateAxis();
    };
    this.onDpad = (event) => {
      const { direction, pressed } = event.detail || {};
      if (direction !== 'left' && direction !== 'right') return;
      if (pressed) this.keys.add(direction);
      else this.keys.delete(direction);
      this.recalculateAxis();
    };

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('darkblood:dpad', this.onDpad);
    scene.events.once('shutdown', () => this.destroy());
  }

  recalculateAxis() {
    const left = this.keys.has('left');
    const right = this.keys.has('right');
    this.axis = left === right ? 0 : (right ? 1 : -1);
  }

  update(sprite, deltaSeconds) {
    if (!sprite || !sprite.active || sprite.casting) return;

    const delta = this.axis * this.speed * deltaSeconds;
    if (delta === 0) {
      sprite.stopRun?.();
      return;
    }

    const left = sprite.worldLeft ?? 32;
    const right = sprite.worldRight ?? 1280;
    const nextX = Phaser.Math.Clamp(sprite.x + delta, left, right);
    const moved = nextX !== sprite.x;

    sprite.x = nextX;
    sprite.setFacing(this.axis < 0 ? 'left' : 'right');

    if (moved) sprite.startRun?.();
    else sprite.stopRun?.();
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('darkblood:dpad', this.onDpad);
    this.keys.clear();
    this.axis = 0;
  }
}
