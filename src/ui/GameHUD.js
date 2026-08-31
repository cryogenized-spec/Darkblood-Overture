import { GAME_WIDTH } from '../config/gameConfig.js';
import './GameHUD.css';

const HUD_SCALE = 0.65;
const HEALTH_FILL_WIDTH = 72;
const XP_BAR_WIDTH = 118;

function element(tag, className, text = '') {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

function emitDpad(direction, pressed) {
  document.dispatchEvent(new window.CustomEvent('darkblood:dpad', {
    detail: { direction, pressed },
  }));
}

function emitSpell(spell) {
  document.dispatchEvent(new window.CustomEvent('darkblood:spell', {
    detail: { spell },
  }));
}

function emitJump() {
  document.dispatchEvent(new window.CustomEvent('darkblood:jump'));
}

function bindDpadButton(button, direction) {
  const press = (event) => {
    event.preventDefault();
    emitDpad(direction, true);
  };
  const release = (event) => {
    event.preventDefault();
    emitDpad(direction, false);
  };
  button.addEventListener('pointerdown', press);
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('pointerleave', release);
  return () => {
    button.removeEventListener('pointerdown', press);
    button.removeEventListener('pointerup', release);
    button.removeEventListener('pointercancel', release);
    button.removeEventListener('pointerleave', release);
  };
}

export class GameHUD {
  constructor(scene) {
    this.scene = scene;
    this.overlay = element('div', 'game-hud-overlay');
    this.status = element('div', 'game-hud-group game-hud-status');
    this.utility = element('div', 'game-hud-group game-hud-utility');
    this.dpad = element('div', 'game-hud-group game-hud-dpad');
    this.jump = element('div', 'game-hud-group game-hud-jump');
    this.spell = element('div', 'game-hud-group game-hud-spell');
    this.xp = element('div', 'game-hud-group game-hud-xp');
    this.healthFill = null;
    this.manaFill = null;
    this.xpFill = null;
    this.levelNode = null;
    this.manaValueNode = null;
    this.spellNode = null;
    this.jumpNode = null;
    this.resizeObserver = null;
    this.dpadCleanup = [];
    this.onSpellPointer = null;
    this.onJumpPointer = null;

    this.createPlayerStatus();
    this.createUtilityMenu();
    this.createDPad();
    this.createJumpButton();
    this.createSpellBar();
    this.createXpBar();

    const container = document.getElementById('game-container');
    if (!container) throw new Error('Game container not found');
    container.appendChild(this.overlay);
    this.updateUnit(container);
    this.resizeObserver = new ResizeObserver(() => this.updateUnit(container));
    this.resizeObserver.observe(container);

    window.requestAnimationFrame(() => this.overlay.classList.add('is-visible'));
  }

  updateUnit(container) {
    const unit = container.clientWidth / GAME_WIDTH;
    this.overlay.style.setProperty('--game-unit', `${unit}px`);
    this.overlay.style.setProperty('--hud-scale', HUD_SCALE);
  }

  createPlayerStatus() {
    const portrait = element('div', 'game-hud-status__portrait', 'A');
    this.levelNode = element('div', 'game-hud-status__level', 'LV 0');
    const name = element('div', 'game-hud-status__name', 'ARABELLA');
    const health = element('div', 'game-hud-bar game-hud-bar--health');
    this.healthFill = element('div', 'game-hud-bar__fill game-hud-fill--health');
    health.appendChild(this.healthFill);
    const mana = element('div', 'game-hud-bar game-hud-bar--mana');
    this.manaFill = element('div', 'game-hud-bar__fill game-hud-fill--mana');
    mana.appendChild(this.manaFill);
    this.manaValueNode = element('div', 'game-hud-mana-value', '50 / 50');
    const hp = element('div', 'game-hud-label game-hud-label--health', 'HP');
    const mp = element('div', 'game-hud-label game-hud-label--mana', 'MP');
    this.status.append(portrait, this.levelNode, name, health, mana, this.manaValueNode, hp, mp);
    this.overlay.appendChild(this.status);
  }

  createUtilityMenu() {
    ['≡', '◇', '□'].forEach((glyph) => {
      this.utility.appendChild(element('div', 'game-hud-button', glyph));
    });
    this.overlay.appendChild(this.utility);
  }

  createDPad() {
    const left = element('button', 'game-hud-dpad__button game-hud-dpad__button--left', '‹');
    const right = element('button', 'game-hud-dpad__button game-hud-dpad__button--right', '›');
    const label = element('span', 'game-hud-dpad__move', 'MOVE');
    left.type = 'button';
    right.type = 'button';
    left.setAttribute('aria-label', 'Move left');
    right.setAttribute('aria-label', 'Move right');
    this.dpad.append(left, right, label);
    this.jumpNode = null;
    this.overlay.appendChild(this.dpad);
    this.dpadCleanup.push(bindDpadButton(left, 'left'));
    this.dpadCleanup.push(bindDpadButton(right, 'right'));
  }

  createJumpButton() {
    const button = element('button', 'game-hud-jump__button', '↑');
    button.type = 'button';
    button.setAttribute('aria-label', 'Jump');
    this.onJumpPointer = (event) => {
      event.preventDefault();
      emitJump();
    };
    button.addEventListener('pointerdown', this.onJumpPointer);
    this.jumpNode = button;
    this.jump.appendChild(button);
    this.dpad.appendChild(this.jump);
  }

  createSpellBar() {
    const orb = element('button', 'game-hud-spell__orb', '☽');
    const label = element('div', 'game-hud-spell__label', 'DARK BOLT');
    const cooldown = element('span', 'game-hud-spell__cooldown');
    orb.type = 'button';
    orb.setAttribute('aria-label', 'Dark Bolt');
    orb.appendChild(cooldown);
    this.onSpellPointer = (event) => {
      event.preventDefault();
      emitSpell('darkBolt');
    };
    orb.addEventListener('pointerdown', this.onSpellPointer);
    this.spell.append(orb, label);
    this.spellNode = this.spell;
    this.spellButton = orb;
    this.spellCooldown = cooldown;
    this.overlay.appendChild(this.spell);
  }

  createXpBar() {
    const label = element('span', 'game-hud-xp__label', 'XP');
    const bar = element('div', 'game-hud-xp__bar');
    this.xpFill = element('div', 'game-hud-xp__fill');
    bar.appendChild(this.xpFill);
    this.xp.append(label, bar);
    this.overlay.appendChild(this.xp);
  }

  setHealth(value) {
    const amount = Math.max(0, Math.min(1, Number(value) || 0));
    this.healthFill.style.width = `calc(var(--game-unit) * ${HEALTH_FILL_WIDTH * amount})`;
  }

  setMana(mana, maxMana) {
    const max = Math.max(1, Number(maxMana) || 1);
    const current = Math.max(0, Math.min(max, Number(mana) || 0));
    this.manaFill.style.width = `calc(var(--game-unit) * ${46.8 * (current / max)})`;
    this.manaValueNode.textContent = `${current.toFixed(1).replace(/\.0$/, '')} / ${max}`;
  }

  setLevel(level) {
    this.levelNode.textContent = `LV ${Math.max(0, Math.floor(Number(level) || 0))}`;
  }

  setXp(xpPercent, level) {
    const amount = Math.max(0, Math.min(1, Number(xpPercent) || 0));
    this.xpFill.style.width = `calc(var(--game-unit) * ${XP_BAR_WIDTH * amount})`;
    this.setLevel(level);
  }

  setSpellCooldown(remainingMs, totalMs) {
    const remaining = Math.max(0, Number(remainingMs) || 0);
    const total = Math.max(1, Number(totalMs) || 1);
    const progress = Math.max(0, Math.min(1, remaining / total));
    this.spellCooldown.style.setProperty('--cooldown-progress', progress);
    this.spellNode.classList.toggle('is-cooling-down', remaining > 0);
    this.spellButton.disabled = remaining > 0;
  }

  flickerHealth() {
    this.healthFill.animate(
      [{ opacity: 0.35 }, { opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }],
      { duration: 320, iterations: 1 },
    );
  }

  setSpellEnabled(enabled) {
    this.spellNode.style.opacity = enabled ? '1' : '0.42';
    this.spellButton.disabled = !enabled;
  }

  destroy() {
    this.dpadCleanup.forEach((cleanup) => cleanup());
    this.dpadCleanup = [];
    if (this.onSpellPointer) {
      this.spellNode?.querySelector('.game-hud-spell__orb')?.removeEventListener('pointerdown', this.onSpellPointer);
      this.onSpellPointer = null;
    }
    if (this.onJumpPointer) {
      this.jumpNode?.removeEventListener('pointerdown', this.onJumpPointer);
      this.onJumpPointer = null;
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.overlay.remove();
  }
}
