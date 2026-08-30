const OVERLAY_ID = 'cinematic-art-overlay';

export function showCinematicArt(path, alt = '') {
  let overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.alt = alt;
    image.draggable = false;
    overlay.appendChild(image);

    document.getElementById('game-container')?.appendChild(overlay);
  }

  const image = overlay.querySelector('img');
  if (image) image.src = path;
  overlay.hidden = false;
  return overlay;
}

export function hideCinematicArt() {
  document.getElementById(OVERLAY_ID)?.remove();
}
