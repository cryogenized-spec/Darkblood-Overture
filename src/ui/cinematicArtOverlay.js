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
  overlay.appendChild(image);

  document.getElementById('game-container')?.appendChild(overlay);
  return overlay;
}

export function showCinematicArt(path, alt = '') {
  const overlay = getOrCreateOverlay();
  const image = overlay.querySelector('img');
  if (!image) return { overlay, ready: Promise.reject(new Error('Cinematic image element not found.')) };

  image.alt = alt;
  image.hidden = true;

  const ready = new Promise((resolve, reject) => {
    const handleLoad = () => {
      image.hidden = false;
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error(`Failed to load cinematic artwork: ${path}`));
    };
    const cleanup = () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
    };

    image.addEventListener('load', handleLoad, { once: true });
    image.addEventListener('error', handleError, { once: true });

    image.src = path;
    if (image.complete && image.naturalWidth > 0) handleLoad();
  });

  overlay.hidden = false;
  return { overlay, ready };
}

export function hideCinematicArt() {
  document.getElementById(OVERLAY_ID)?.remove();
}
