export const SKELETON_INFANTRY_DISPLAY_HEIGHT = 64;

// All walk artwork faces right when unflipped. The "left"/"right" suffixes name
// the stride phase (which foot is in contact), not a mirrored sprite — the two
// halves of the cycle are drawn as separate frames.
export const SKELETON_INFANTRY_WALK_FRAMES = Object.freeze([
  { name: 'contactRight', file: '01-walk-contact-right.png' },
  { name: 'downRight', file: '02-walk-down-right.png' },
  { name: 'passingRight', file: '03-walk-passing-right.png' },
  { name: 'contactLeft', file: '04-walk-contact-left.png' },
  { name: 'downLeft', file: '05-walk-down-left.png' },
  { name: 'passingLeft', file: '06-walk-passing-left.png' },
  { name: 'contactRightReturn', file: '07-walk-contact-right-return.png' },
  { name: 'recovery', file: '08-walk-recovery.png' },
]);

export const SKELETON_INFANTRY_TEXTURE_KEYS = Object.freeze(
  Object.fromEntries(
    SKELETON_INFANTRY_WALK_FRAMES.map(({ name }) => [name, `skeleton-infantry-walk-${name}`]),
  ),
);

export const SKELETON_INFANTRY_SPRITE_PATH = `${import.meta.env.BASE_URL}assets/sprites/enemies/skeleton-infantry/walk/`;

// Six-frame looping stride (contact -> down -> passing, alternating legs).
export const SKELETON_INFANTRY_STRIDE = Object.freeze([
  'contactRight',
  'downRight',
  'passingRight',
  'contactLeft',
  'downLeft',
  'passingLeft',
]);

export const SKELETON_INFANTRY_WALK_FRAME_MS = 120;
export const SKELETON_INFANTRY_WALK_SPEED = 38;

// Tuning for how a skeleton enters the scene and how durable it is.
export const SKELETON_INFANTRY = Object.freeze({
  displayName: 'Skeleton Infantry',
  // Health is derived from the player's max health, not a hard-coded number.
  healthRatio: 0.5,
  // Seconds after the player takes control before the first skeleton walks in.
  spawnDelayMs: 10000,
  // Horizontal offset to the right of the player where the skeleton appears.
  spawnOffsetX: 260,
  // The skeleton stops advancing once it closes to within this distance.
  guardDistance: 84,
  // A short hesitation once it stops, before it settles into a guard pose.
  settlePauseMs: 550,
});
