export const DARK_BOLT_CAST_DISPLAY_HEIGHT = 64;
export const DARK_BOLT_CAST_FRAME_MS = 115;
export const DARK_BOLT_CAST_FRAMES = Object.freeze([
  { name: 'ready', file: '01-darkbolt-ready.png' },
  { name: 'raise', file: '02-darkbolt-raise.png' },
  { name: 'release', file: '03-darkbolt-release.png' },
  { name: 'recoil', file: '04-darkbolt-recoil.png' },
  { name: 'settle', file: '05-darkbolt-settle.png' },
]);
export const DARK_BOLT_CAST_TEXTURE_KEYS = Object.freeze(
  Object.fromEntries(DARK_BOLT_CAST_FRAMES.map(({ name }) => [name, `arabella-darkbolt-cast-${name}`])),
);
export const DARK_BOLT_CAST_SPRITE_PATH = `${import.meta.env.BASE_URL}assets/sprites/characters/arabella/cast-dark-bolt/`;
// The bolt leaves her hand on the throw pose, not on the 'release' keyframe:
// in the 'release' artwork the consolidated charge is still hovering cupped
// above her palm, so spawning the projectile there made the shot fly off
// before Arabella had finished her cast motion. 'recoil' is the first frame
// whose art shows the charge launched clear of the hand.
export const DARK_BOLT_RELEASE_FRAME = 'recoil';
// Normalized position of the launched bolt in the release-frame artwork
// (DARK_BOLT_RELEASE_FRAME): the bright charge core just clear of her thrust
// palm, measured from the recoil sprite. The unflipped art faces right
// (matching idle/run); the casting hand sits toward the sprite's left edge,
// so the bolt leaves the hand on the far side of the body.
export const DARK_BOLT_CAST_HAND_POSITION = Object.freeze({ x: 0.22, y: 0.25 });

export const DARK_BOLT_PROJECTILE_DISPLAY_HEIGHT = 16;
export const DARK_BOLT_PROJECTILE_DISPLAY_WIDTH_SCALE = 1.25;
export const DARK_BOLT_PROJECTILE_FRAME_MS = 70;
export const DARK_BOLT_PROJECTILE_SPEED = 225;
export const DARK_BOLT_PROJECTILE_MAX_LIFETIME_MS = 2600;
// Recovery already blocks another cast for the full animation; show that in the HUD.
export const DARK_BOLT_COOLDOWN_MS = DARK_BOLT_CAST_FRAME_MS * DARK_BOLT_CAST_FRAMES.length;
export const DARK_BOLT_MANA_COST = 2.5;
export const DARK_BOLT_DAMAGE = 20;

export const DARK_BOLT_PROJECTILE_FRAMES = Object.freeze([
  { name: 'flightA', file: '01-dark-bolt-flight-a.png' },
  { name: 'flightB', file: '02-dark-bolt-flight-b.png' },
  { name: 'flightC', file: '03-dark-bolt-flight-c.png' },
]);
export const DARK_BOLT_PROJECTILE_TEXTURE_KEYS = Object.freeze(
  Object.fromEntries(DARK_BOLT_PROJECTILE_FRAMES.map(({ name }) => [name, `dark-bolt-projectile-${name}`])),
);
export const DARK_BOLT_PROJECTILE_SPRITE_PATH = `${import.meta.env.BASE_URL}assets/sprites/projectiles/dark-bolt/`;
