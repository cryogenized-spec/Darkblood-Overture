const DOUBLE_BACK_WINDOW_MS = 400;

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

export function installAndroidBackExit() {
  if (!isAndroid()) return () => {};

  let lastBackAt = 0;
  let guardActive = false;

  const armGuard = () => {
    window.history.pushState({ darkbloodBackGuard: true }, '', window.location.href);
    guardActive = true;
  };

  const handlePopState = () => {
    const now = performance.now();
    const isDoubleBack = now - lastBackAt <= DOUBLE_BACK_WINDOW_MS;
    lastBackAt = now;

    if (isDoubleBack) {
      guardActive = false;
      window.close();
      return;
    }

    armGuard();
  };

  armGuard();
  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
    if (guardActive) window.history.back();
  };
}
