const PROMPT_ID = 'title-prompt';

export function createTitlePrompt(text = 'PRESS ANY KEY') {
  let element = document.getElementById(PROMPT_ID);

  if (!element) {
    element = document.createElement('div');
    element.id = PROMPT_ID;
    element.className = 'title-prompt';
    element.setAttribute('aria-hidden', 'true');
    document.getElementById('game-shell')?.appendChild(element);
  }

  element.textContent = text;
  element.style.display = 'block';
  return element;
}

export function hideTitlePrompt() {
  const element = document.getElementById(PROMPT_ID);
  if (element) element.style.display = 'none';
}
