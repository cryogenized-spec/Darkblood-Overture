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

export const DARK_BOLT_PROJECTILE_DISPLAY_HEIGHT = 810;
export const DARK_BOLT_PROJECTILE_DISPLAY_WIDTH_SCALE = 1.25;
export const DARK_BOLT_PROJECTILE_FRAME_MS = 70;
export const DARK_BOLT_PROJECTILE_SPEED = 225;
export const DARK_BOLT_PROJECTILE_MAX_LIFETIME_MS = 2600;
export const DARK_BOLT_COOLDOWN_MS = 200;
export const DARK_BOLT_MANA_COST = 2.5;

export const DARK_BOLT_PROJECTILE_FRAMES = Object.freeze([
  { name: 'flightA', file: '01-dark-bolt-flight-a.png' },
  { name: 'flightB', file: '02-dark-bolt-flight-b.png' },
  { name: 'flightC', file: '03-dark-bolt-flight-c.png' },
]);
export const DARK_BOLT_PROJECTILE_TEXTURE_KEYS = Object.freeze(
  Object.fromEntries(DARK_BOLT_PROJECTILE_FRAMES.map(({ name }) => [name, `dark-bolt-projectile-${name}`])),
);
export const DARK_BOLT_PROJECTILE_SPRITE_PATH = `${import.meta.env.BASE_URL}assets/sprites/projectiles/dark-bolt/`;
