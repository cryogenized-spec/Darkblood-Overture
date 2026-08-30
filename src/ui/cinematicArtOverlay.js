const OVERLAY_ID = 'cinematic-art-overlay';

function getOrCreateOverlay() {
  let overlay = document.getElementById(OVERLAY_ID);
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('aria-hidden', 'true');

  const image = document.createElement('img');
  image.alt = '';
  image.draggable = false;
  image.hidden = true;
  image.addEventListener('load', () => {
    image.hidden = false;
  });
  overlay.appendChild(image);

  document.getElementById('game-container')?.appendChild(overlay);
  return overlay;
}

export function showCinematicArt(path, alt = '') {
  const overlay = getOrCreateOverlay();
  const image = overlay.querySelector('img');
  if (!image) return overlay;

  image.alt = alt;
  image.hidden = true;
  image.src = path;
  if (image.complete && image.naturalWidth > 0) image.hidden = false;
  overlay.hidden = false;
  return overlay;
}

export function hideCinematicArt() {
  document.getElementById(OVERLAY_ID)?.remove();
}
