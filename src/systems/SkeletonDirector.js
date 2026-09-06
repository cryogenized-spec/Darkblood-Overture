import {
  SKELETON_INFANTRY,
  SKELETON_INFANTRY_WALK_SPEED,
} from '../data/skeletonInfantry.js';
import { SkeletonInfantry } from '../entities/SkeletonInfantry.js';

// A skeleton walks in from off-screen, advances on the player, and settles into
// a guard stance once it is close enough. The AI is deliberately lightweight so
// the units read as living patrols rather than sliding sprites; attack actions
// are intentionally left for a later pass.
const STATE = Object.freeze({
  ADVANCING: 'advancing',
  SETTLING: 'settling',
  GUARDING: 'guarding',
});

export class SkeletonDirector {
  constructor(scene, groundY) {
    this.scene = scene;
    this.groundY = groundY;
    this.skeletons = [];
    this.spawnTimerMs = SKELETON_INFANTRY.spawnDelayMs;
    this.spawned = false;
  }

  // Restores a clean pre-spawn patrol so tests (and scene restarts) can
  // simulate the delay from a known clock instead of whatever the live loop
  // already consumed.
  reset() {
    this.destroy();
    this.spawnTimerMs = SKELETON_INFANTRY.spawnDelayMs;
    this.spawned = false;
  }

  spawnOne(player) {
    if (!player?.active) return null;

    const left = player.worldLeft ?? 32;
    const right = player.worldRight ?? 1280;
    const spawnX = Math.min(right, Math.max(left, player.x + SKELETON_INFANTRY.spawnOffsetX));
    const maxHealth = Math.max(1, Math.round((player.maxHealth || 1) * SKELETON_INFANTRY.healthRatio));

    const skeleton = SkeletonInfantry.create(this.scene, spawnX, this.groundY, { maxHealth });
    skeleton.state = STATE.ADVANCING;
    skeleton.settleTimerMs = 0;
    skeleton.guardX = spawnX;
    skeleton.setFacing('left');
    this.skeletons.push(skeleton);
    this.spawned = true;
    return skeleton;
  }

  update(deltaMs, player) {
    let aiDeltaMs = deltaMs;

    if (!this.spawned) {
      this.spawnTimerMs -= deltaMs;
      if (this.spawnTimerMs > 0) return;
      // Only the time *after* the spawn instant should animate the new unit.
      // Dumping the whole delay into one step made it sprint past the player.
      aiDeltaMs = Math.max(0, -this.spawnTimerMs);
      if (!this.spawnOne(player)) {
        this.spawnTimerMs = 0;
        return;
      }
    }

    const deltaSeconds = aiDeltaMs / 1000;

    this.skeletons.slice().forEach((skeleton) => {
      if (!skeleton.active) {
        this.skeletons.splice(this.skeletons.indexOf(skeleton), 1);
        return;
      }
      this.updateSkeleton(skeleton, player, deltaSeconds, aiDeltaMs);
    });
  }

  beginSettling(skeleton, facingLeft) {
    skeleton.state = STATE.SETTLING;
    skeleton.settleTimerMs = SKELETON_INFANTRY.settlePauseMs;
    skeleton.moving = false;
    skeleton.setFacing(facingLeft ? 'left' : 'right');
  }

  updateSkeleton(skeleton, player, deltaSeconds, deltaMs) {
    if (!skeleton.alive) {
      skeleton.moving = false;
      skeleton.updateWalk(deltaMs);
      return;
    }

    const dx = (player?.active ? player.x : skeleton.guardX) - skeleton.x;
    const distance = Math.abs(dx);
    const facingLeft = dx < 0;

    switch (skeleton.state) {
      case STATE.ADVANCING: {
        if (distance <= SKELETON_INFANTRY.guardDistance) {
          this.beginSettling(skeleton, facingLeft);
          break;
        }
        const direction = facingLeft ? -1 : 1;
        const maxStep = distance - SKELETON_INFANTRY.guardDistance;
        const step = Math.min(SKELETON_INFANTRY_WALK_SPEED * deltaSeconds, maxStep);
        skeleton.x += direction * step;
        skeleton.setFacing(facingLeft ? 'left' : 'right');
        skeleton.moving = step > 0;
        if (step >= maxStep) this.beginSettling(skeleton, facingLeft);
        break;
      }
      case STATE.SETTLING: {
        skeleton.settleTimerMs -= deltaMs;
        if (skeleton.settleTimerMs <= 0) {
          skeleton.state = STATE.GUARDING;
        }
        break;
      }
      case STATE.GUARDING: {
        // Hold position and keep the player in view; re-advance if the player
        // drifts out of guard range so the patrol stays responsive.
        if (distance > SKELETON_INFANTRY.guardDistance) {
          skeleton.state = STATE.ADVANCING;
          break;
        }
        skeleton.setFacing(facingLeft ? 'left' : 'right');
        skeleton.moving = false;
        break;
      }
      default:
        break;
    }

    skeleton.updateWalk(deltaMs);
  }

  destroy() {
    this.skeletons.forEach((skeleton) => skeleton.destroy());
    this.skeletons = [];
  }
}
