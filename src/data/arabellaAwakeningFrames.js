export const ARABELLA_SPRITE_SIZE = Object.freeze({
  width: 96,
  height: 112,
});

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
