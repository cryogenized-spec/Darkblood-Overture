// A full-screen black veil used to push the title screen out through three
// increasing stages of darkness before the awakening cinematic takes over.
// It lives above the title artwork and press-any-key prompt, so the fade-to-
// black reads over the whole screen rather than only the Phaser canvas.

const VEIL_ID = 'darkness-veil';
const DEFAULT_STAGES = [0.4, 0.74, 1];
const DEFAULT_STAGE_MS = 300;
const DEFAULT_STAGE_GAP_MS = 120;

function getVeil() {
  return document.getElementById(VEIL_ID);
}

function getOrCreateVeil() {
  let veil = getVeil();
  if (veil) return veil;

  veil = document.createElement('div');
  veil.id = VEIL_ID;
  veil.className = 'darkness-veil';
  veil.setAttribute('aria-hidden', 'true');
  veil.style.opacity = '0';
  veil.style.pointerEvents = 'none';
  document.getElementById('game-shell')?.appendChild(veil);
  return veil;
}

// Animates the veil through `stages` of increasing opacity, holding a short
// gap between each plateau so the darkening reads as three distinct steps.
// Resolves once the screen is fully black.
export function fadeToDarkness({
  stages = DEFAULT_STAGES,
  stageMs = DEFAULT_STAGE_MS,
  stageGapMs = DEFAULT_STAGE_GAP_MS,
} = {}) {
  const veil = getOrCreateVeil();
  veil.style.opacity = '0';

  const targets = Array.isArray(stages) ? stages.slice(0, 3) : DEFAULT_STAGES;
  return new Promise((resolve) => {
    let current = 0;

    const step = (index) => {
      if (index >= targets.length) {
        veil.style.opacity = '1';
        resolve();
        return;
      }

      const target = targets[index];
      const animation = veil.animate(
        [{ opacity: current }, { opacity: target }],
        { duration: stageMs, easing: 'ease-in', fill: 'forwards' },
      );
      animation.onfinish = () => {
        current = target;
        veil.style.opacity = String(target);
        window.setTimeout(() => step(index + 1), stageGapMs);
      };
    };

    step(0);
  });
}

export function clearDarkness() {
  getVeil()?.remove();
}
