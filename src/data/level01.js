export const LEVEL_01 = {
  id: 'graveyard-01',
  name: 'Graveyard',
  movement: 'horizontal',
  art: {
    // Sockets for the upcoming three-plane parallax artwork.
    far: null,
    mid: null,
    near: null,
  },
  ground: null,
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
