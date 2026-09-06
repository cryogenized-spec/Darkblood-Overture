import { expect, test } from '@playwright/test';

// Load the real Phaser assets, then skip the intro to exercise gameplay directly.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => window.darkbloodGame?.scene.isActive('DevSplashScene'));
  await page.evaluate(() => {
    const game = window.darkbloodGame;
    game.scene.stop('DevSplashScene');
    game.scene.start('GameScene');
  });
  await page.waitForFunction(() => window.darkbloodGame.scene.getScene('GameScene').player?.active);
  await page.evaluate(() => {
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    scene.skeletonDirector?.reset();
  });
});

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors()).toEqual([]);
});

test('spawns nothing until the delay elapses, then walks in from the right', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const data = await import('/src/data/skeletonInfantry.js');
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    const director = scene.skeletonDirector;
    director.reset();
    const player = scene.player;

    const beforeDelay = director.skeletons.length;
    director.update(data.SKELETON_INFANTRY.spawnDelayMs - 1, player);
    const stillEmpty = director.skeletons.length;

    director.update(1, player);
    const skeleton = director.skeletons[0];
    const spawned = skeleton && {
      count: director.skeletons.length,
      x: skeleton.x,
      playerX: player.x,
      health: skeleton.health,
      maxHealth: skeleton.maxHealth,
      expectedHealth: Math.round(player.maxHealth * data.SKELETON_INFANTRY.healthRatio),
      facing: skeleton.facing,
      state: skeleton.state,
    };

    const startX = skeleton.x;
    director.update(1000, player);
    const moved = skeleton && {
      x: skeleton.x,
      movedLeft: skeleton.x < startX,
      moving: skeleton.moving,
    };

    return { beforeDelay, stillEmpty, spawned, moved };
  });

  expect(result.beforeDelay).toBe(0);
  expect(result.stillEmpty).toBe(0);
  expect(result.spawned.count).toBe(1);
  expect(result.spawned.x).toBeGreaterThan(result.spawned.playerX);
  expect(result.spawned.health).toBe(result.spawned.expectedHealth);
  expect(result.spawned.health).toBe(result.spawned.maxHealth);
  expect(result.spawned.facing).toBe('left');
  expect(result.moved.movedLeft).toBe(true);
  expect(result.moved.moving).toBe(true);
});

test('stops at guard range and faces the player once it settles', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const data = await import('/src/data/skeletonInfantry.js');
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    const director = scene.skeletonDirector;
    director.reset();
    const player = scene.player;

    director.update(data.SKELETON_INFANTRY.spawnDelayMs, player);
    const skeleton = director.skeletons[0];

    // Advance far enough that it reaches guard range and settles.
    for (let i = 0; i < 40; i += 1) director.update(250, player);

    return {
      state: skeleton.state,
      moving: skeleton.moving,
      distance: Math.abs(player.x - skeleton.x),
      guardDistance: data.SKELETON_INFANTRY.guardDistance,
      facing: skeleton.facing,
      alive: skeleton.alive,
    };
  });

  expect(result.state).toBe('guarding');
  expect(result.moving).toBe(false);
  expect(result.distance).toBeLessThanOrEqual(result.guardDistance);
  expect(result.facing).toBe('left');
  expect(result.alive).toBe(true);
});

test('a dark bolt damages the skeleton and destroys it when health runs out', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const skeletonData = await import('/src/data/skeletonInfantry.js');
    const boltData = await import('/src/data/darkBoltFrames.js');
    window.darkbloodGame.loop.sleep();
    const scene = window.darkbloodGame.scene.getScene('GameScene');
    const director = scene.skeletonDirector;
    director.reset();
    const player = scene.player;

    director.update(skeletonData.SKELETON_INFANTRY.spawnDelayMs, player);
    const skeleton = director.skeletons[0];
    skeleton.state = 'guarding';
    skeleton.moving = false;

    const maxHealth = skeleton.maxHealth;
    const hitsToKill = Math.ceil(maxHealth / boltData.DARK_BOLT_DAMAGE);

    for (let i = 0; i < hitsToKill; i += 1) {
      scene.spawnDarkBolt(skeleton.x, skeleton.y - 16, 1);
      scene.update(0, 16);
    }

    return {
      health: skeleton.health,
      alive: skeleton.alive,
      maxHealth,
      hitsToKill,
      damagePerHit: boltData.DARK_BOLT_DAMAGE,
    };
  });

  expect(result.health).toBe(0);
  expect(result.alive).toBe(false);
  expect(result.damagePerHit).toBeGreaterThan(0);
  expect(result.hitsToKill * result.damagePerHit).toBeGreaterThanOrEqual(result.maxHealth);
});
