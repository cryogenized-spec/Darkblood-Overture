export const ARABELLA_RUN_DISPLAY_HEIGHT = 112;

export const ARABELLA_RUN_FRAMES = Object.freeze([
  { name: 'contactLeft', file: '01-run-contact-left.png' },
  { name: 'downLeft', file: '02-run-down-left.png' },
  { name: 'passingLeft', file: '03-run-passing-left.png' },
  { name: 'upLeft', file: '04-run-up-left.png' },
  { name: 'contactRight', file: '05-run-contact-right.png' },
  { name: 'downRight', file: '06-run-down-right.png' },
  { name: 'passingRight', file: '07-run-passing-right.png' },
  { name: 'upRight', file: '08-run-up-right.png' },
  { name: 'transitionLeft', file: '09-run-transition-left.png' },
  { name: 'transitionRight', file: '10-run-transition-right.png' },
  { name: 'settleLeft', file: '11-run-settle-left.png' },
  { name: 'settleRight', file: '12-run-settle-right.png' },
]);

export const ARABELLA_RUN_TEXTURE_KEYS = Object.freeze(
  Object.fromEntries(
    ARABELLA_RUN_FRAMES.map(({ name }) => [name, `arabella-run-${name}`]),
  ),
);

export const ARABELLA_RUN_SPRITE_PATH = `${import.meta.env.BASE_URL}assets/sprites/characters/arabella/run/`;
