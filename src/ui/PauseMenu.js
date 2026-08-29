import { GAME_WIDTH, GAME_HEIGHT } from '../config/gameConfig.js';

export class PauseMenu {
  constructor(scene) {
    this.scene = scene;
    this.visible = false;
    this.container = scene.add.container(0, 0).setDepth(2000).setVisible(false);

    const dim = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.72);
    const panel = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 192, 108, 0x0b0910, 0.98)
      .setStrokeStyle(1, 0xc9aacd, 0.65);
    const title = scene.add.text(GAME_WIDTH / 2, 33, 'PAUSED', {
      color: '#f4f0e7', fontFamily: 'serif', fontSize: '9px', letterSpacing: 3,
    }).setOrigin(0.5);

    const body = scene.add.text(GAME_WIDTH / 2, 54,
      'CONTROLS\n\nD-PAD POSITION    [ RESERVED ]\nD-PAD SIZE          [ RESERVED ]\nD-PAD OPACITY       [ RESERVED ]\n\nOPTIONS / SAVE / QUIT    [ RESERVED ]',
      {
        color: '#9a8d9e', fontFamily: 'monospace', fontSize: '4px',
        lineSpacing: 3, align: 'center',
      }).setOrigin(0.5, 0);

    const close = scene.add.text(GAME_WIDTH / 2, 144, 'ESC / TAP TO RESUME', {
      color: '#f4f0e7', fontFamily: 'monospace', fontSize: '5px', letterSpacing: 1,
    }).setOrigin(0.5);

    this.container.add([dim, panel, title, body, close]);
  }

  toggle() {
    this.visible = !this.visible;
    this.container.setVisible(this.visible);
    this.scene.physics?.world?.isPaused !== undefined && (this.scene.physics.world.isPaused = this.visible);
    return this.visible;
  }
}
