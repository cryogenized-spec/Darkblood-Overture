import Phaser from 'phaser';

export class QueenPlaceholder extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);

    this.glow = scene.add.circle(0, -28, 8, 0x6f4d89, 0.16);
    this.body = scene.add.ellipse(0, 0, 18, 46, 0x100d15, 0.96).setStrokeStyle(1, 0xc9aacd, 0.55);
    this.head = scene.add.circle(0, -31, 7, 0x8b5d54, 1).setStrokeStyle(1, 0xf4f0e7, 0.3);
    this.hair = scene.add.arc(-3, -33, 11, 200, 340, false, 0x09080d, 1);
    this.crown = scene.add.text(0, -39, '♕', { color: '#c9aacd', fontFamily: 'serif', fontSize: '8px' }).setOrigin(0.5);
    this.staff = scene.add.rectangle(14, -23, 2, 48, 0x8a6a53, 1).setAngle(-8);
    this.staffOrb = scene.add.circle(17, -48, 4, 0x8a5ec0, 0.9).setStrokeStyle(1, 0xe5d8ee, 0.65);
    this.shadow = scene.add.ellipse(0, 20, 32, 6, 0x000000, 0.45);

    this.add([this.glow, this.shadow, this.body, this.head, this.hair, this.crown, this.staff, this.staffOrb]);
    this.setDepth(20);
  }

  kneel() {
    this.setScale(1, 0.72);
    this.y += 8;
  }

  rise() {
    this.scene.tweens.add({
      targets: this,
      scaleY: 1,
      y: this.y - 8,
      duration: 650,
      ease: 'Cubic.out',
    });
  }

  lookUp() {
    this.scene.tweens.add({ targets: this.head, angle: -7, duration: 360, ease: 'Sine.out' });
    this.scene.tweens.add({ targets: this.crown, y: -41, duration: 360, ease: 'Sine.out' });
    this.scene.tweens.add({ targets: this.glow, alpha: 0.5, scale: 1.7, duration: 500, ease: 'Sine.out' });
  }
}
