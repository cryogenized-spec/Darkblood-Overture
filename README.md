# Darkblood: Overture

> ダークブラッド：オーバーチュア

A landscape-only 2D dark-fantasy browser game built with Phaser 4.2.1.

## Pass 1 foundation

The first pass establishes the project shell without prematurely building gameplay systems.

- Phaser 4.2.1 game runtime
- Vite build/dev pipeline
- Tailwind CSS foundation for browser UI
- Landscape-only presentation shell
- Pixel-art rendering configuration
- Development splash placeholder
- Main title-screen placeholder
- CSS/DOM `PRESS ANY KEY` prompt hook
- Multi-beat fade transition into the first game scene
- Level 01 data socket
- Three-plane parallax system socket (`far`, `mid`, `near`)
- Escalating wave director socket
- Timed skeleton-infantry patrol (spawns ~10s in, walks in from the right and
  settles into a guard stance; health derived from the player's max health)
- Queen and spell content placeholders
- GitHub Actions build check

## Planned Level 01 direction

The first playable area is a graveyard with horizontal movement only. The next pass will introduce the three depth planes and ground layer, then the Queen and enemy waves. Threat should escalate through data rather than scene-specific hard-coding.

## Development principle

Keep scenes, content data, entities and gameplay systems separate. Prefer replaceable sockets and data-driven configuration over tightly coupled scene logic. Each pass should leave a runnable build.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Gameplay regression tests

Use Node.js 24 or later. After `npm install`, install the test browser once:

```bash
npx playwright install chromium
npm test
```

The browser tests load the real game and cover Dark Bolt's release timing, hand alignment,
left/right flight across the scrolling level, cleanup, mana/cooldown state, pause, and
keyboard/touch controls. The test runner starts Vite automatically; if reusing a dev server,
start it with `npm run dev -- --base=/`.

## Art

Final splash/title artwork and gameplay pixel assets will be added as separate assets. The title scene is deliberately prepared so artwork can be replaced without changing its input flow.

© 2026 Obsidian Moon Studio.
