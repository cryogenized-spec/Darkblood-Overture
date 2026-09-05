import { expect, test } from '@playwright/test';

// Load the real Phaser assets, then skip the intro to exercise gameplay directly.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Enter the Overture' }).click();
  await page.waitForFunction(() => window.darkbloodGame?.scene.isActive('DevSplashScene'));
  await page.evaluate(() => {
    const game = window.darkbloodGame;
    game.scene.stop('DevSplashScene');
    game.scene.start('GameScene');
  });
  await page.waitForFunction(() => window.darkbloodGame.scene.getScene('GameScene').player?.active);
});

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors()).toEqual([]);
});

for (const facing of ['left', 'right']) {
  test(`releases exactly one bolt from the ${facing}-facing hand, including in the air`, async ({ page }) => {
    const result = await page.evaluate(async (facing) => {
      const data = await import('/src/data/darkBoltFrames.js');
      const game = window.darkbloodGame;
      game.loop.sleep();
      const scene = game.scene.getScene('GameScene');
      const player = scene.player;
      player.manaRegenPerSecond = 0;
      player.x = 800;
      player.setFacing(facing);
      player.startRun();
      player.jump();
      player.updatePhysics(0.15);
      const initialMana = player.mana;
      const accepted = player.castDarkBolt();
      const duplicateAccepted = player.castDarkBolt();
      const runVisible = player.runSprite.visible;
      const releaseMs = data.DARK_BOLT_CAST_FRAME_MS
        * data.DARK_BOLT_CAST_FRAMES.findIndex((frame) => frame.name === 'release');
      player.updateAnimations(releaseMs - 1);
      const beforeRelease = scene.projectiles.getLength();
      player.updateAnimations(1);
      const bolt = scene.projectiles.getChildren()[0];
      const released = bolt && {
        count: scene.projectiles.getLength(),
        casting: player.casting,
        x: bolt.x,
        y: bolt.y,
        height: bolt.displayHeight,
        direction: bolt.direction,
        flipped: bolt.flipX,
        castFlipped: player.castSprite.flipX,
      };
      const duration = data.DARK_BOLT_CAST_FRAME_MS * data.DARK_BOLT_CAST_FRAMES.length;
      player.updateAnimations(duration - releaseMs);
      player.updateAnimations(duration);
      return {
        accepted, duplicateAccepted, runVisible, beforeRelease, released,
        expectedX: player.x + (facing === 'left' ? -1 : 1)
          * (0.5 - data.DARK_BOLT_CAST_HAND_POSITION.x) * player.castSprite.displayWidth,
        expectedY: player.y + (data.DARK_BOLT_CAST_HAND_POSITION.y - 1)
          * player.castSprite.displayHeight,
        expectedHeight: data.DARK_BOLT_PROJECTILE_DISPLAY_HEIGHT,
        expectedMana: initialMana - data.DARK_BOLT_MANA_COST,
        mana: player.mana,
        finalCount: scene.projectiles.getLength(),
        casting: player.casting,
        idleVisible: player.idleSprite.visible,
      };
    }, facing);

    expect(result.accepted).toBe(true);
    expect(result.duplicateAccepted).toBe(false);
    expect(result.runVisible).toBe(false);
    expect(result.beforeRelease).toBe(0);
    expect(result.released).toMatchObject({
      count: 1, casting: true, direction: facing === 'left' ? -1 : 1,
      flipped: facing === 'left', castFlipped: facing === 'right',
    });
    expect(result.released.x).toBeCloseTo(result.expectedX, 3);
    expect(result.released.y).toBeCloseTo(result.expectedY, 3);
    expect(result.released.height).toBe(result.expectedHeight);
    expect(result.finalCount).toBe(1);
    expect(result.mana).toBe(result.expectedMana);
    expect(result.casting).toBe(false);
    expect(result.idleVisible).toBe(true);
  });
}

test('does not lose or duplicate a shot when one update skips the entire cast', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const data = await import('/src/data/darkBoltFrames.js');
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    const duration = data.DARK_BOLT_CAST_FRAME_MS * data.DARK_BOLT_CAST_FRAMES.length;
    scene.player.castDarkBolt();
    scene.player.updateAnimations(duration + 100);
    const firstCount = scene.projectiles.getLength();
    scene.player.updateAnimations(duration);
    const idleCount = scene.projectiles.getLength();
    const acceptedAgain = scene.player.castDarkBolt();
    scene.player.updateAnimations(duration);
    return { firstCount, idleCount, acceptedAgain, secondCount: scene.projectiles.getLength() };
  });
  expect(result).toEqual({ firstCount: 1, idleCount: 1, acceptedAgain: true, secondCount: 2 });
});

test('bolts travel and animate in both directions throughout the scrolling world', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const data = await import('/src/data/darkBoltFrames.js');
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    scene.cameras.main.setScroll(640, 0);
    return [-1, 1].map((direction) => {
      scene.spawnDarkBolt(800, 120, direction);
      const bolt = scene.projectiles.getChildren()[0];
      const textures = [bolt.texture.key];
      for (let frame = 1; frame < data.DARK_BOLT_PROJECTILE_FRAMES.length; frame += 1) {
        bolt.updateProjectile(data.DARK_BOLT_PROJECTILE_FRAME_MS);
        textures.push(bolt.texture.key);
      }
      const travelMs = data.DARK_BOLT_PROJECTILE_FRAME_MS * (textures.length - 1);
      const x = bolt.x;
      const activeAfterTravel = bolt.active;
      bolt.updateProjectile(data.DARK_BOLT_PROJECTILE_MAX_LIFETIME_MS - travelMs - 1);
      const activeBeforeExpiry = bolt.active;
      bolt.updateProjectile(1);
      return {
        x, expectedX: 800 + direction * data.DARK_BOLT_PROJECTILE_SPEED * travelMs / 1000,
        activeAfterTravel, activeBeforeExpiry, activeAfterExpiry: bolt.active,
        textureCount: new Set(textures).size,
        expectedTextureCount: data.DARK_BOLT_PROJECTILE_FRAMES.length,
        remaining: scene.projectiles.getLength(),
      };
    });
  });
  for (const bolt of result) {
    expect(bolt.x).toBeCloseTo(bolt.expectedX, 3);
    expect(bolt.activeAfterTravel).toBe(true);
    expect(bolt.textureCount).toBe(bolt.expectedTextureCount);
    expect(bolt.activeBeforeExpiry).toBe(true);
    expect(bolt.activeAfterExpiry).toBe(false);
    expect(bolt.remaining).toBe(0);
  }
});

test('only culls a bolt once its entire artwork passes a world edge', async ({ page }) => {
  const result = await page.evaluate(() => {
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    const bounds = scene.cameras.main.getBounds();
    return [-1, 1].map((direction) => {
      const edge = direction < 0 ? bounds.left : bounds.right;
      scene.spawnDarkBolt(edge + direction, 120, direction);
      const bolt = scene.projectiles.getChildren()[0];
      bolt.updateProjectile(0);
      const partlyVisible = bolt.active;
      bolt.x = edge + direction * bolt.displayWidth;
      bolt.updateProjectile(0);
      return { partlyVisible, outside: bolt.active, remaining: scene.projectiles.getLength() };
    });
  });
  expect(result).toEqual([
    { partlyVisible: true, outside: false, remaining: 0 },
    { partlyVisible: true, outside: false, remaining: 0 },
  ]);
});

test('the spell button respects the full cast recovery and available mana', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const data = await import('/src/data/darkBoltFrames.js');
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    const { player, hud } = scene;
    hud.setSpellEnabled(false);
    hud.setSpellCooldown(0, data.DARK_BOLT_COOLDOWN_MS);
    const disabledAfterCooldownUpdate = hud.spellButton.disabled;
    hud.setSpellCooldown(data.DARK_BOLT_COOLDOWN_MS, data.DARK_BOLT_COOLDOWN_MS);
    hud.setSpellEnabled(true);
    const disabledAfterEnableUpdate = hud.spellButton.disabled;
    player.manaRegenPerSecond = 0;
    player.mana = data.DARK_BOLT_MANA_COST - 0.1;
    scene.update(0, 0);
    const lowManaDisabled = hud.spellButton.disabled;
    const lowManaAccepted = player.castDarkBolt();
    const manaAfterRejection = player.mana;
    player.mana = data.DARK_BOLT_MANA_COST;
    scene.update(0, 0);
    const readyDisabled = hud.spellButton.disabled;
    player.castDarkBolt();
    scene.update(0, 0);
    const ringProgress = window.getComputedStyle(hud.spellButton, '::after')
      .getPropertyValue('--cooldown-progress').trim();
    scene.update(0, 200);
    const recoveringDisabled = hud.spellButton.disabled;
    scene.update(0, data.DARK_BOLT_COOLDOWN_MS - 200);
    const emptyManaDisabled = hud.spellButton.disabled;
    player.manaRegenPerSecond = data.DARK_BOLT_MANA_COST / 4;
    scene.update(0, 4000);
    return {
      disabledAfterCooldownUpdate, disabledAfterEnableUpdate, lowManaDisabled, lowManaAccepted,
      manaAfterRejection, expectedRejectedMana: data.DARK_BOLT_MANA_COST - 0.1,
      readyDisabled, ringProgress, recoveringDisabled, emptyManaDisabled,
      regeneratedDisabled: hud.spellButton.disabled,
    };
  });
  expect(result.disabledAfterCooldownUpdate).toBe(true);
  expect(result.disabledAfterEnableUpdate).toBe(true);
  expect(result.lowManaDisabled).toBe(true);
  expect(result.lowManaAccepted).toBe(false);
  expect(result.manaAfterRejection).toBe(result.expectedRejectedMana);
  expect(result.readyDisabled).toBe(false);
  expect(result.ringProgress).toBe('1');
  expect(result.recoveringDisabled).toBe(true);
  expect(result.emptyManaDisabled).toBe(true);
  expect(result.regeneratedDisabled).toBe(false);
});

test('pausing freezes bolts and prevents new casts or mana charges', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const data = await import('/src/data/darkBoltFrames.js');
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    scene.player.castDarkBolt();
    scene.update(0, data.DARK_BOLT_COOLDOWN_MS);
    const bolt = scene.projectiles.getChildren()[0];
    scene.togglePause();
    const before = { x: bolt.x, lifetime: bolt.lifetimeMs, mana: scene.player.mana };
    const acceptedWhilePaused = scene.player.castDarkBolt();
    scene.update(0, 1000);
    const after = { x: bolt.x, lifetime: bolt.lifetimeMs, mana: scene.player.mana };
    const pausedDisabled = scene.hud.spellButton.disabled;
    scene.togglePause();
    scene.update(0, 16);
    return { before, after, acceptedWhilePaused, pausedDisabled, canCastAfterResume: scene.player.canCastDarkBolt() };
  });
  expect(result.after).toEqual(result.before);
  expect(result.acceptedWhilePaused).toBe(false);
  expect(result.pausedDisabled).toBe(true);
  expect(result.canCastAfterResume).toBe(true);
});

test('Space and the touch button both fire after scrolling away from the first screen', async ({ page }) => {
  await page.evaluate(() => {
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    scene.player.x = 800;
    window.darkbloodShotLog = [];
    const spawn = scene.spawnDarkBolt.bind(scene);
    scene.spawnDarkBolt = (x, y, direction) => {
      window.darkbloodShotLog.push({ x, y, direction, frame: scene.player.castSprite.sequenceIndex });
      spawn(x, y, direction);
    };
  });
  await page.keyboard.press('Space');
  await expect.poll(() => page.evaluate(() => window.darkbloodShotLog.length)).toBe(1);
  await expect(page.getByRole('button', { name: 'Dark Bolt', exact: true })).toBeEnabled();
  await page.evaluate(() => window.darkbloodGame.scene.getScene('GameScene').player.setFacing('left'));
  await page.getByRole('button', { name: 'Dark Bolt', exact: true }).tap();
  await expect.poll(() => page.evaluate(() => window.darkbloodShotLog.length)).toBe(2);
  const result = await page.evaluate(() => {
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    return { shots: window.darkbloodShotLog, active: scene.projectiles.getLength(), scroll: scene.cameras.main.scrollX };
  });
  expect(result.shots.map(({ direction, frame }) => ({ direction, frame }))).toEqual([
    { direction: 1, frame: 2 }, { direction: -1, frame: 2 },
  ]);
  expect(result.active).toBe(2);
  expect(result.scroll).toBeGreaterThan(0);
});
