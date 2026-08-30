import { ArabellaDarkBoltCastSprite } from './ArabellaDarkBoltCastSprite.js';
import { ArabellaIdleSprite } from './ArabellaIdleSprite.js';
import { ArabellaRunSprite } from './ArabellaRunSprite.js';
import { DarkBoltProjectile } from './DarkBoltProjectile.js';

const CAST_HAND_OFFSET_X = 18;
const CAST_HAND_OFFSET_Y = -30;

export class ArabellaPlayer {
  static create(scene, x, y) {
    const container = scene.add.container(x, y);
    const idle = ArabellaIdleSprite.create(scene, 0, 0);
    const run = ArabellaRunSprite.create(scene, 0, 0);
    const cast = ArabellaDarkBoltCastSprite.create(scene, 0, 0);

    container.add([idle, run, cast]);
    container.setDepth(20);
    container.setScrollFactor(1);
    container.facing = 'right';
    container.moving = false;
    container.casting = false;
    container.castTimer = 0;
    container.castReleased = false;
    container.worldLeft = 32;
    container.worldRight = 1280;
    container.idleSprite = idle;
    container.runSprite = run;
    container.castSprite = cast;

    idle.setVisible(true);
    run.setVisible(false);
    cast.setVisible(false);

    container.setFacing = (direction) => {
      container.facing = direction === 'left' ? 'left' : 'right';
      idle.setFlipX(container.facing === 'left');
      run.setFacing(container.facing);
      cast.setFlipX(container.facing === 'left');
    };

    container.startRun = () => {
      if (container.casting || container.moving) return;
      container.moving = true;
      idle.setVisible(false);
      cast.setVisible(false);
      run.setVisible(true);
      run.startRun();
    };

    container.stopRun = () => {
      if (container.casting) return;
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

    container.castDarkBolt = () => {
      if (container.casting || !scene.sys.isActive()) return false;
      container.casting = true;
      container.moving = false;
      container.castTimer = 0;
      container.castReleased = false;
      idle.setVisible(false);
      run.setVisible(false);
      run.stopRun();
      cast.setPosition(0, 0);
      cast.setFlipX(container.facing === 'left');
      cast.beginCast();
      return true;
    };

    container.updateAnimations = (deltaMs) => {
      if (container.casting) {
        const result = cast.updateCast(deltaMs);
        if (result.released && !container.castReleased) {
          container.castReleased = true;
          const direction = container.facing === 'left' ? -1 : 1;
          const projectileX = container.x + direction * CAST_HAND_OFFSET_X;
          const projectileY = container.y + CAST_HAND_OFFSET_Y;
          scene.spawnDarkBolt?.(projectileX, projectileY, direction);
        }
        if (result.done) {
          container.casting = false;
          container.castReleased = false;
          cast.setVisible(false);
          idle.sequenceIndex = 0;
          idle.frameTimer = 0;
          idle.setArtworkFrame('neutral');
          idle.setFlipX(container.facing === 'left');
          idle.setVisible(true);
        }
        return;
      }

      if (container.moving) run.updateRun(deltaMs);
      else idle.updateIdle(deltaMs);
    };

    container.setWorldBounds = (left, right) => {
      container.worldLeft = left;
      container.worldRight = right;
      container.x = Math.min(Math.max(container.x, left), right);
    };

    return container;
  }
}
