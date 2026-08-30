export const LEVEL_01 = {
  id: 'graveyard-01',
  name: 'Graveyard',
  movement: 'horizontal',
  art: {
    far: 'procedural-graveyard-far',
    mid: 'procedural-graveyard-mid',
    near: 'procedural-graveyard-near',
    parallax: {
      far: 0.12,
      mid: 0.36,
      near: 0.72,
    },
  },
  ground: {
    y: 160,
    height: 20,
  },
  waves: {
    mode: 'sequential',
    threatCurve: 'escalating',
    definitions: [],
  },
};

export function createLevel01Runtime() {
  return {
    ...LEVEL_01,
    state: {
      waveIndex: 0,
      threatLevel: 0,
    },
  };
}
