import { ArabellaDarkBoltCastSprite } from './ArabellaDarkBoltCastSprite.js';
import { ArabellaIdleSprite } from './ArabellaIdleSprite.js';
import { ArabellaRunSprite } from './ArabellaRunSprite.js';
import {
  DARK_BOLT_COOLDOWN_MS,
  DARK_BOLT_MANA_COST,
} from '../data/darkBoltFrames.js';

const CAST_HAND_OFFSET_X = 20;
const CAST_HAND_OFFSET_Y = -40;
const JUMP_VELOCITY = -110;
const GRAVITY = 300;
const INITIAL_MAX_MANA = 50;
const INITIAL_MANA = 50;
const MANA_REGEN_PER_SECOND = DARK_BOLT_MANA_COST / 4;
const INITIAL_LEVEL = 0;
const INITIAL_XP = 0;
const XP_TO_NEXT_LEVEL = 100;

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
    container.castReleased = false;
    container.groundY = y;
    container.verticalVelocity = 0;
    container.jumping = false;
    container.worldLeft = 32;
    container.worldRight = 1280;
    container.idleSprite = idle;
    container.runSprite = run;
    container.castSprite = cast;
    container.maxMana = INITIAL_MAX_MANA;
    container.mana = INITIAL_MANA;
    container.manaRegenPerSecond = MANA_REGEN_PER_SECOND;
    container.level = INITIAL_LEVEL;
    container.xp = INITIAL_XP;
    container.xpToNextLevel = XP_TO_NEXT_LEVEL;
    container.darkBoltCooldownMs = 0;

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
      if (container.casting || container.moving || container.jumping) return;
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

    container.jump = () => {
      if (container.casting || container.jumping) return false;
      container.jumping = true;
      container.verticalVelocity = JUMP_VELOCITY;
      return true;
    };

    container.updatePhysics = (deltaSeconds) => {
      if (!container.jumping) return;
      container.verticalVelocity += GRAVITY * deltaSeconds;
      container.y += container.verticalVelocity * deltaSeconds;
      if (container.y >= container.groundY) {
        container.y = container.groundY;
        container.verticalVelocity = 0;
        container.jumping = false;
      }
    };

    container.canCastDarkBolt = () => (
      !container.casting
      && container.darkBoltCooldownMs <= 0
      && container.mana >= DARK_BOLT_MANA_COST
      && scene.sys.isActive()
    );

    container.getManaPercent = () => (
      container.maxMana > 0 ? container.mana / container.maxMana : 0
    );

    container.getXpPercent = () => (
      container.xpToNextLevel > 0 ? container.xp / container.xpToNextLevel : 0
    );

    container.addXp = (amount) => {
      let remaining = Math.max(0, Number(amount) || 0);
      while (remaining > 0) {
        const needed = container.xpToNextLevel - container.xp;
        if (remaining < needed) {
          container.xp += remaining;
          remaining = 0;
        } else {
          remaining -= needed;
          container.xp = 0;
          container.level += 1;
          container.xpToNextLevel = Math.max(100, Math.round(container.xpToNextLevel * 1.25));
        }
      }
    };

    container.castDarkBolt = () => {
      if (!container.canCastDarkBolt()) return false;
      container.casting = true;
      container.moving = false;
      container.castReleased = false;
      container.darkBoltCooldownMs = DARK_BOLT_COOLDOWN_MS;
      container.mana = Math.max(0, container.mana - DARK_BOLT_MANA_COST);
      idle.setVisible(false);
      run.setVisible(false);
      run.stopRun();
      cast.setPosition(0, 0);
      cast.setFlipX(container.facing === 'left');
      cast.beginCast();
      return true;
    };

    container.updateAnimations = (deltaMs) => {
      container.darkBoltCooldownMs = Math.max(0, container.darkBoltCooldownMs - deltaMs);
      container.mana = Math.min(container.maxMana, container.mana + container.manaRegenPerSecond * (deltaMs / 1000));

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
