import { GAME_WIDTH } from '../config/gameConfig.js';
import './GameHUD.css';

const HUD_SCALE = 0.65;

function element(tag, className, text = '') {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

export class GameHUD {
  constructor(scene) {
    this.scene = scene;
    this.overlay = element('div', 'game-hud-overlay');
    this.status = element('div', 'game-hud-group game-hud-status');
    this.utility = element('div', 'game-hud-group game-hud-utility');
    this.dpad = element('div', 'game-hud-group game-hud-dpad');
    this.spell = element('div', 'game-hud-group game-hud-spell');
    this.healthFill = null;
    this.spellNode = null;
    this.resizeObserver = null;

    this.createPlayerStatus();
    this.createUtilityMenu();
    this.createDPad();
    this.createSpellBar();

    const container = document.getElementById('game-container');
    if (!container) throw new Error('Game container not found');
    container.appendChild(this.overlay);
    this.updateUnit(container);
    this.resizeObserver = new ResizeObserver(() => this.updateUnit(container));
    this.resizeObserver.observe(container);

    this.overlay.style.opacity = '0';
    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 1,
      duration: 350,
      ease: 'Sine.out',
    });
  }

  updateUnit(container) {
    const unit = container.clientWidth / GAME_WIDTH;
    this.overlay.style.setProperty('--game-unit', `${unit}px`);
    this.overlay.style.setProperty('--hud-scale', HUD_SCALE);
  }

  createPlayerStatus() {
    const portrait = element('div', 'game-hud-status__portrait', 'A');
    const name = element('div', 'game-hud-status__name', 'ARABELLA');

    const health = element('div', 'game-hud-bar game-hud-bar--health');
    this.healthFill = element('div', 'game-hud-bar__fill game-hud-fill--health');
    health.appendChild(this.healthFill);

    const mana = element('div', 'game-hud-bar game-hud-bar--mana');
    const manaFill = element('div', 'game-hud-bar__fill game-hud-fill--mana');
    mana.appendChild(manaFill);

    const hp = element('div', 'game-hud-label game-hud-label--health', 'HP');
    const mp = element('div', 'game-hud-label game-hud-label--mana', 'MP');
    this.status.append(portrait, name, health, mana, hp, mp);
    this.overlay.appendChild(this.status);
  }

  createUtilityMenu() {
    ['≡', '◇', '□'].forEach((glyph) => {
      this.utility.appendChild(element('div', 'game-hud-button', glyph));
    });
    this.overlay.appendChild(this.utility);
  }

  createDPad() {
    this.dpad.append(element('span', '', '‹'));
    this.dpad.append(element('span', '', '›'));
    this.dpad.append(element('span', 'game-hud-dpad__move', 'MOVE'));
    this.overlay.appendChild(this.dpad);
  }

  createSpellBar() {
    const orb = element('div', 'game-hud-spell__orb', '☽');
    const label = element('div', 'game-hud-spell__label', 'DARK BOLT');
    this.spell.append(orb, label);
    this.spellNode = this.spell;
    this.overlay.appendChild(this.spell);
  }

  setHealth(value) {
    const amount = Math.max(0, Math.min(1, Number(value) || 0));
    const width = 72 * amount;
    this.healthFill.style.width = `${width}px`;
    this.scene.tweens.add({
      targets: this.healthFill,
      width: width,
      duration: 120,
      ease: 'Quad.out',
    });
  }

  flickerHealth() {
    this.healthFill.animate(
      [{ opacity: 0.35 }, { opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }],
      { duration: 320, iterations: 1 },
    );
  }

  setSpellEnabled(enabled) {
    this.spellNode.style.opacity = enabled ? '1' : '0.42';
  }

  destroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.overlay.remove();
  }
}
