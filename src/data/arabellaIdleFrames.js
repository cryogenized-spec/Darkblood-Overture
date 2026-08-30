export const ARABELLA_IDLE_DISPLAY_HEIGHT = 64;

export const ARABELLA_IDLE_FRAMES = Object.freeze([
  { name: 'neutral', file: '01-idle-neutral.png' },
  { name: 'breathIn', file: '02-idle-breath-in.png' },
  { name: 'settle', file: '03-idle-settle.png' },
  { name: 'breathOut', file: '04-idle-breath-out.png' },
  { name: 'hairShift', file: '05-idle-hair-shift.png' },
  { name: 'neutralReturn', file: '06-idle-neutral-return.png' },
]);

export const ARABELLA_IDLE_TEXTURE_KEYS = Object.freeze(
  Object.fromEntries(
    ARABELLA_IDLE_FRAMES.map(({ name }) => [name, `arabella-idle-${name}`]),
  ),
);

export const ARABELLA_IDLE_SPRITE_PATH = `${import.meta.env.BASE_URL}assets/sprites/characters/arabella/idle/`;
