export const QUEEN = {
  id: 'queen',
  displayName: 'ARABELLA',
  archetype: 'Shadowborn Arcanist',
  visual: {
    ageRead: 'late-20s',
    skin: 'tanned Mediterranean complexion',
    hair: 'long black hair',
    eyes: 'azure / gold',
    lips: 'black',
    ears: 'demonic pointed ears',
    teeth: 'subtle canine tips',
  },
  equipment: {
    primary: 'ancient staff',
  },
  portrait: {
    // The portrait whose gaze meets the player, framed by the HUD status
    // roundel in the top-left corner, left of the life/mana bars. A face-
    // cropped derivative of the monologue artwork so the tiny roundel stays
    // legible (and cheap) instead of shrinking the full bust.
    file: 'assets/ui/portraits/arabella-hud-portrait.png',
    source: 'assets/ui/dialogue/arabella/arabella-monologue.png',
    alt: 'Arabella, the Shadowborn Arcanist',
  },
  animationSockets: ['idle', 'walk', 'cast', 'hurt', 'death'],
  entrance: {
    healthStartsEmpty: true,
    lifeforceLabel: 'LIFEFORCE CONSOLIDATING',
    awarenessFlash: '#e8d7ef',
    // The frame whose gaze opens: her eyes awaken and the lifeforce label
    // surfaces, but the life bar stays empty until the surge below.
    awarenessFrame: 'eyesAwaken',
    lifeforce: {
      // The surge frame: purple lightning rises around her and, in sync with
      // it, the empty life bar consolidates to full — never beyond max.
      startFrame: 'lifeforceSurge',
      lightningDurationMs: 1600,
      healthFillMs: 950,
    },
  },
};
