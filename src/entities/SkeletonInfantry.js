import {
  SKELETON_INFANTRY_DISPLAY_HEIGHT,
  SKELETON_INFANTRY_STRIDE,
  SKELETON_INFANTRY_TEXTURE_KEYS,
  SKELETON_INFANTRY_WALK_FRAME_MS,
} from '../data/skeletonInfantry.js';

const IDLE_FRAME = 'recovery';

export class SkeletonInfantry {
  static create(scene, x, y, { maxHealth }) {
    const textureKey = SKELETON_INFANTRY_TEXTURE_KEYS.contactRight;
    if (!scene.textures.exists(textureKey)) {
      throw new Error(`Skeleton Infantry texture '${textureKey}' was not loaded before GameScene.`);
    }

    const sprite = scene.add.sprite(x, y, textureKey);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(18);
    sprite.setVisible(true);
    sprite.setAlpha(1);
    sprite.setScrollFactor(1);
    sprite.baseHeight = SKELETON_INFANTRY_DISPLAY_HEIGHT;

    sprite.facing = 'right';
    sprite.moving = false;
    sprite.sequenceIndex = 0;
    sprite.frameTimer = 0;

    sprite.maxHealth = Math.max(1, Number(maxHealth) || 1);
    sprite.health = sprite.maxHealth;
    sprite.alive = true;

    const applyFrameScale = () => {
      const source = sprite.texture.getSourceImage();
      if (!source || source.height <= 0) {
        throw new Error('Skeleton Infantry texture has invalid source dimensions.');
      }
      sprite.setScale(sprite.baseHeight / source.height);
    };

    sprite.setArtworkFrame = (name) => {
      const nextKey = SKELETON_INFANTRY_TEXTURE_KEYS[name];
      if (!nextKey || !scene.textures.exists(nextKey)) {
        throw new Error(`Unknown Skeleton Infantry frame '${name}'.`);
      }
      sprite.setTexture(nextKey);
      applyFrameScale();
    };

    sprite.setFacing = (direction) => {
      sprite.facing = direction === 'left' ? 'left' : 'right';
      sprite.setFlipX(sprite.facing === 'left');
    };

    // Advance the walk animation while `moving` is true; resets to the idle
    // stance when movement stops so it never freezes mid-stride.
    sprite.updateWalk = (deltaMs) => {
      if (!sprite.moving) {
        if (sprite.sequenceIndex !== -1) {
          sprite.sequenceIndex = -1;
          sprite.frameTimer = 0;
          sprite.setArtworkFrame(IDLE_FRAME);
        }
        return;
      }
      if (sprite.sequenceIndex < 0) {
        sprite.sequenceIndex = 0;
        sprite.frameTimer = 0;
        sprite.setArtworkFrame(SKELETON_INFANTRY_STRIDE[0]);
      }
      sprite.frameTimer += deltaMs;
      while (sprite.frameTimer >= SKELETON_INFANTRY_WALK_FRAME_MS) {
        sprite.frameTimer -= SKELETON_INFANTRY_WALK_FRAME_MS;
        sprite.sequenceIndex = (sprite.sequenceIndex + 1) % SKELETON_INFANTRY_STRIDE.length;
        sprite.setArtworkFrame(SKELETON_INFANTRY_STRIDE[sprite.sequenceIndex]);
      }
    };

    sprite.takeDamage = (amount) => {
      if (!sprite.alive) return false;
      sprite.health = Math.max(0, sprite.health - (Number(amount) || 0));
      if (sprite.health <= 0) {
        sprite.alive = false;
        sprite.setTint(0x808080);
      } else {
        // Brief hurt flash so hits read even before a dedicated hurt animation.
        sprite.setTint(0xffd7d7);
        scene.time.delayedCall(90, () => {
          if (sprite.active) sprite.clearTint();
        });
      }
      return true;
    };

    applyFrameScale();
    sprite.updateWalk(0);
    return sprite;
  }
}
