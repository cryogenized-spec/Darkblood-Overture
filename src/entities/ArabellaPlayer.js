import { ArabellaIdleSprite } from './ArabellaIdleSprite.js';
import { ArabellaRunSprite } from './ArabellaRunSprite.js';

export class ArabellaPlayer {
  static create(scene, x, y) {
    const container = scene.add.container(x, y);
    const idle = ArabellaIdleSprite.create(scene, 0, 0);
    const run = ArabellaRunSprite.create(scene, 0, 0);

    container.add([idle, run]);
    container.setDepth(20);
    container.setScrollFactor(1);
    container.facing = 'right';
    container.moving = false;
    container.idleSprite = idle;
    container.runSprite = run;
    container.worldLeft = 32;
    container.worldRight = 1280;

    idle.setVisible(true);
    run.setVisible(false);

    container.setFacing = (direction) => {
      container.facing = direction === 'left' ? 'left' : 'right';
      idle.setFlipX(container.facing === 'left');
      run.setFacing(container.facing);
    };

    container.startRun = () => {
      if (container.moving) return;
      container.moving = true;
      idle.setVisible(false);
      run.setVisible(true);
      run.startRun();
    };

    container.stopRun = () => {
      if (!container.moving) {
        run.setVisible(false);
        idle.setVisible(true);
        return;
      }
      container.moving = false;
      run.stopRun();
      run.setVisible(false);
      idle.sequenceIndex = 0;
      idle.frameTimer = 0;
      idle.setArtworkFrame('neutral');
      idle.setVisible(true);
    };

    container.updateAnimations = (deltaMs) => {
      if (container.moving) run.updateRun(deltaMs);
      else idle.updateIdle(deltaMs);
    };

    container.setWorldBounds = (left, right) => {
      container.worldLeft = left;
      container.worldRight = right;
      container.x = PhaserMathClamp(container.x, left, right);
    };

    return container;
  }
}

function PhaserMathClamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
