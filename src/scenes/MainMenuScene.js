import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
    this.options = ['NEW GAME', 'LOAD GAME', 'OPTIONS', 'CREDITS'];
    this.selected = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor('#08070b');

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 20, GAME_HEIGHT - 20)
      .setStrokeStyle(1, 0x6c5b77, 0.45);

    this.add.text(GAME_WIDTH / 2, 30, 'MAIN MENU', {
      color: '#f4f0e7',
      fontFamily: 'Georgia, serif',
      fontSize: '8px',
      letterSpacing: 3,
    }).setOrigin(0.5);

    this.menuText = this.options.map((label, index) => this.add.text(GAME_WIDTH / 2, 61 + index * 17, label, {
      color: index === 0 ? '#f4f0e7' : '#726b76',
      fontFamily: 'Georgia, serif',
      fontSize: '7px',
      letterSpacing: 2,
    }).setOrigin(0.5));

    this.helpText = this.add.text(GAME_WIDTH / 2, 151, 'ARROW KEYS / TAP  •  SELECT  •  CONFIRM', {
      color: '#4c4650',
      fontFamily: 'monospace',
      fontSize: '4px',
      letterSpacing: 0.6,
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-UP', this.moveUp, this);
    this.input.keyboard?.on('keydown-DOWN', this.moveDown, this);
    this.input.keyboard?.on('keydown-ENTER', this.confirm, this);
    this.input.keyboard?.on('keydown-SPACE', this.confirm, this);
    this.input.on('pointerdown', (_pointer, currentlyOver) => {
      const target = currentlyOver?.find((item) => this.menuText.includes(item));
      if (target) {
        this.selected = this.menuText.indexOf(target);
        this.refreshSelection();
        this.confirm();
      }
    });

    this.events.once('shutdown', () => {
      this.input.keyboard?.off('keydown-UP', this.moveUp, this);
      this.input.keyboard?.off('keydown-DOWN', this.moveDown, this);
      this.input.keyboard?.off('keydown-ENTER', this.confirm, this);
      this.input.keyboard?.off('keydown-SPACE', this.confirm, this);
    });
  }

  moveUp() {
    this.selected = (this.selected - 1 + this.options.length) % this.options.length;
    this.refreshSelection();
  }

  moveDown() {
    this.selected = (this.selected + 1) % this.options.length;
    this.refreshSelection();
  }

  refreshSelection() {
    this.menuText.forEach((text, index) => {
      text.setColor(index === this.selected ? '#f4f0e7' : '#726b76');
    });
  }

  confirm() {
    switch (this.selected) {
      case 0:
        this.scene.start('GameScene');
        break;
      case 1:
        this.showPlaceholder('LOAD GAME', 'SAVE SYSTEM RESERVED FOR A FUTURE PASS');
        break;
      case 2:
        this.showPlaceholder('OPTIONS', 'SETTINGS FRAMEWORK RESERVED FOR A FUTURE PASS');
        break;
      case 3:
        this.showPlaceholder('CREDITS', 'OBSIDIAN MOON STUDIO');
        break;
    }
  }

  showPlaceholder(title, body) {
    const panel = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    panel.add(this.add.rectangle(0, 0, 210, 58, 0x08070b, 0.97).setStrokeStyle(1, 0x8e7e98, 0.55));
    panel.add(this.add.text(0, -14, title, {
      color: '#f4f0e7', fontFamily: 'Georgia, serif', fontSize: '7px', letterSpacing: 2,
    }).setOrigin(0.5));
    panel.add(this.add.text(0, 1, body, {
      color: '#8b828f', fontFamily: 'monospace', fontSize: '4px', letterSpacing: 0.5, align: 'center',
      wordWrap: { width: 180 },
    }).setOrigin(0.5));
    panel.add(this.add.text(0, 17, 'TAP / ENTER TO CLOSE', {
      color: '#f4f0e7', fontFamily: 'monospace', fontSize: '4px', letterSpacing: 1,
    }).setOrigin(0.5));

    const close = () => {
      panel.destroy(true);
      this.input.keyboard?.off('keydown-ENTER', close);
      this.input.keyboard?.off('keydown-SPACE', close);
      this.input.off('pointerdown', close);
    };

    this.input.keyboard?.once('keydown-ENTER', close);
    this.input.keyboard?.once('keydown-SPACE', close);
    this.input.once('pointerdown', close);
  }
}
