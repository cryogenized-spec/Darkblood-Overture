const KEY_TO_DIRECTION = Object.freeze({
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
});

export class PlayerController {
  constructor(scene, speed = 70) {
    this.scene = scene;
    this.speed = speed;
    this.axis = 0;
    this.keys = new Set();
    this.onKeyDown = (event) => {
      const direction = KEY_TO_DIRECTION[event.code];
      if (!direction) return;
      this.keys.add(direction);
      this.recalculateAxis();
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
    if (!sprite || !sprite.active) return;
    const delta = this.axis * this.speed * deltaSeconds;
    if (delta === 0) {
      sprite.stopRun?.();
      return;
    }

    sprite.x = Phaser.Math.Clamp(sprite.x + delta, 18, 302);
    sprite.setFacing(this.axis < 0 ? 'left' : 'right');
    sprite.startRun?.();
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('darkblood:dpad', this.onDpad);
    this.keys.clear();
    this.axis = 0;
  }
}
