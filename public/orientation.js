(() => {
  const gate = document.getElementById('orientation-gate');
  const title = document.getElementById('orientation-title');
  const message = document.getElementById('orientation-message');
  const symbol = document.getElementById('orientation-symbol');
  const button = document.getElementById('orientation-continue');
  const hint = document.getElementById('orientation-hint');

  if (!gate || !title || !message || !symbol || !button || !hint) return;

  let landscapeReady = false;
  let acknowledged = false;

  const isLandscape = () => window.innerWidth > window.innerHeight;

  const update = () => {
    landscapeReady = isLandscape();
    if (acknowledged) return;

    if (landscapeReady) {
      symbol.textContent = '✦';
      title.textContent = 'Landscape detected';
      message.textContent = 'The veil is open. Tap anywhere to enter the Overture.';
      button.hidden = false;
      hint.textContent = 'Tap anywhere to continue';
      gate.setAttribute('aria-label', 'Landscape detected. Tap anywhere to continue.');
    } else {
      symbol.textContent = '⟲';
      title.textContent = 'Landscape only';
      message.textContent = 'Turn your device sideways to enter the game.';
      button.hidden = true;
      hint.textContent = 'The game is locked to landscape.';
      gate.setAttribute('aria-label', 'Orientation gate. Rotate your device to landscape.');
    }
  };

  const acknowledge = () => {
    if (!landscapeReady || acknowledged) return;
    acknowledged = true;
    window.darkbloodOrientationReady = true;
    button.disabled = true;
    gate.classList.add('orientation-gate-exit');
    window.dispatchEvent(new Event('darkblood:orientation-ready'));
    window.setTimeout(() => gate.remove(), 420);
  };

  window.addEventListener('orientationchange', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  gate.addEventListener('pointerup', acknowledge);
  button.addEventListener('click', acknowledge);
  gate.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && landscapeReady) {
      event.preventDefault();
      acknowledge();
    }
  });

  update();
})();
