export const ARABELLA_SPRITE_DISPLAY_HEIGHT = 64;

// The reference frame anchors the consistent scale for the whole sequence. The
// awakening artwork consists of separately cropped canvases of wildly different
// pixel dimensions (the character starts collapsed and ends fully upright), so
// scaling every frame by its own height would make her balloon and "jump".
// Instead every frame is scaled by the factor derived from this one standing
// frame, which keeps her feet planted and lets the sequence read as a rise.
export const ARABELLA_AWAKENING_REFERENCE_FRAME = 'conscious';

export const ARABELLA_AWAKENING_FRAMES = Object.freeze([
  { name: 'dormant', file: '01-dormant.png' },
  { name: 'shadowStir', file: '02-shadow-stir.png' },
  { name: 'beginRise', file: '03-begin-rise.png' },
  { name: 'firstRise', file: '04-first-rise.png' },
  { name: 'halfSettle', file: '05-half-settle.png' },
  { name: 'secondRise', file: '06-second-rise.png' },
  { name: 'fullStance', file: '07-full-stance.png' },
  { name: 'settle', file: '08-settle.png' },
  { name: 'headLifting', file: '09-head-lifting.png' },
  { name: 'headUp', file: '10-head-up.png' },
  { name: 'eyesAwaken', file: '11-eyes-awaken.png' },
  { name: 'lifeforceSurge', file: '12-lifeforce-surge.png' },
  { name: 'conscious', file: '13-conscious.png' },
]);

export const ARABELLA_TEXTURE_KEYS = Object.freeze(
  Object.fromEntries(
    ARABELLA_AWAKENING_FRAMES.map(({ name }) => [name, `arabella-awakening-${name}`]),
  ),
);

export const ARABELLA_SPRITE_PATH = `${import.meta.env.BASE_URL}assets/sprites/characters/arabella/awakening/`;
