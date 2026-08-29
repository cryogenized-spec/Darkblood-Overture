import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

const UI = {
  bone: 0xf4f0e7,
  mauve: 0xc9aacd,
  violet: 0x7b5aa0,
  dark: 0x09080d,
  red: 0xa72f45,
  mana: 0x635b9a,
};

function stylizedButton(scene, x, y, size, glyph, label = '') {
  const container = scene.add.container(x, y);
  const outer = scene.add.circle(0, 0, size / 2 + 2, UI.dark, 0.9)
    .setStrokeStyle(1, UI.mauve, 0.65);
  const inner = scene.add.circle(0, 0, size / 2 - 1, 0x15111b, 0.96)
    .setStrokeStyle(1, UI.violet, 0.5);
  const icon = scene.add.text(0, -1, glyph, {
    color: '#f4f0e7',
    fontFamily: 'serif',
    fontSize: `${Math.max(6, Math.round(size * 0.28))}px`,
    fontStyle: 'bold',
  }).setOrigin(0.5);
  container.add([outer, inner, icon]);
  if (label) {
    container.add(scene.add.text(0, size / 2 + 5, label, {
      color: '#8f8095',
      fontFamily: 'monospace',
      fontSize: '4px',
      letterSpacing: 0.5,
    }).setOrigin(0.5));
  }
  return container;
}

export class GameHUD {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setDepth(1000);
    this.createPlayerStatus();
    this.createUtilityMenu();
    this.createDPad();
    this.createSpellBar();
    this.createHudFade();
  }

  createPlayerStatus() {
    const s = this.scene;
    const c = s.add.container(12, 12);

    c.add(s.add.circle(0, 0, 12, UI.dark, 0.92).setStrokeStyle(1, UI.mauve, 0.8));
    c.add(s.add.circle(0, 0, 9, 0x15111b, 1).setStrokeStyle(1, UI.violet, 0.45));
    c.add(s.add.text(0, 1, 'A', {
      color: '#c9aacd', fontFamily: 'serif', fontSize: '8px', fontStyle: 'italic',
    }).setOrigin(0.5));

    c.add(s.add.text(17, -8, 'ARABELLA', {
      color: '#f4f0e7', fontFamily: 'serif', fontSize: '6px', letterSpacing: 1,
    }));

    this.healthBack = s.add.rectangle(17, 2, 74, 5, UI.dark, 0.9).setOrigin(0, 0.5)
      .setStrokeStyle(1, UI.mauve, 0.45);
    this.healthFill = s.add.rectangle(18, 2, 0, 3, UI.red, 0.95).setOrigin(0, 0.5);

    this.manaBack = s.add.rectangle(17, 10, 74, 5, UI.dark, 0.9).setOrigin(0, 0.5)
      .setStrokeStyle(1, UI.mauve, 0.35);
    this.manaFill = s.add.rectangle(18, 10, 72, 3, UI.mana, 0.9).setOrigin(0, 0.5);

    this.healthLabel = s.add.text(94, 0, 'HP', {
      color: '#9d7884', fontFamily: 'monospace', fontSize: '4px',
    });
    this.manaLabel = s.add.text(94, 8, 'MP', {
      color: '#716c94', fontFamily: 'monospace', fontSize: '4px',
    });

    c.add([
      this.healthBack, this.healthFill, this.manaBack, this.manaFill,
      this.healthLabel, this.manaLabel,
    ]);
    this.container.add(c);
  }

  createUtilityMenu() {
    this.utility = this.scene.add.container(GAME_WIDTH - 17, 14);
    this.utility.add(stylizedButton(this.scene, -24, 0, 16, '≡'));
    this.utility.add(stylizedButton(this.scene, 0, 0, 16, '◇'));
    this.utility.add(stylizedButton(this.scene, 24, 0, 16, '□'));
    this.container.add(this.utility);
  }

  createDPad() {
    const s = this.scene;
    this.dpad = s.add.container(21, GAME_HEIGHT - 20);
    this.dpad.add(s.add.circle(0, 0, 16, UI.dark, 0.72).setStrokeStyle(1, UI.mauve, 0.45));
    this.dpad.add(s.add.rectangle(-7, 0, 14, 5, UI.mauve, 0.78).setStrokeStyle(1, UI.violet, 0.7));
    this.dpad.add(s.add.text(-7, 0, '‹', {
      color: '#f4f0e7', fontFamily: 'serif', fontSize: '12px',
    }).setOrigin(0.5));
    this.dpad.add(s.add.text(7, 0, '›', {
      color: '#f4f0e7', fontFamily: 'serif', fontSize: '12px',
    }).setOrigin(0.5));
    this.dpad.add(s.add.text(0, 11, 'MOVE', {
      color: '#716877', fontFamily: 'monospace', fontSize: '3px', letterSpacing: 0.5,
    }).setOrigin(0.5));
    this.dpad.setAlpha(0.92);
    this.container.add(this.dpad);
  }

  createSpellBar() {
    const s = this.scene;
    this.spellBar = s.add.container(GAME_WIDTH - 30, GAME_HEIGHT - 25);
    this.spell = s.add.container(0, 0);
    this.spell.add(s.add.circle(0, 0, 14, UI.dark, 0.9).setStrokeStyle(1, UI.mauve, 0.7));
    this.spell.add(s.add.circle(0, 0, 11, 0x1b1424, 1).setStrokeStyle(1, UI.violet, 0.6));
    this.spell.add(s.add.text(0, -2, '☽', {
      color: '#d7c6df', fontFamily: 'serif', fontSize: '10px',
    }).setOrigin(0.5));
    this.spell.add(s.add.text(0, 18, 'DARK BOLT', {
      color: '#a893ad', fontFamily: 'monospace', fontSize: '4px', letterSpacing: 0.5,
    }).setOrigin(0.5));
    this.spellBar.add(this.spell);
    this.container.add(this.spellBar);
  }

  createHudFade() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: { from: 0, to: 1 },
      duration: 350,
      ease: 'Sine.out',
    });
  }

  setHealth(value) {
    const amount = Phaser.Math.Clamp(value, 0, 1);
    this.scene.tweens.killTweensOf(this.healthFill);
    this.scene.tweens.add({
      targets: this.healthFill,
      width: 72 * amount,
      duration: 120,
      ease: 'Quad.out',
    });
  }

  flickerHealth() {
    this.scene.tweens.add({
      targets: this.healthFill,
      alpha: { from: 0.35, to: 1 },
      duration: 80,
      yoyo: true,
      repeat: 3,
    });
  }

  setSpellEnabled(enabled) {
    this.spell.setAlpha(enabled ? 1 : 0.42);
  }

  destroy() {
    this.container.destroy(true);
  }
}
