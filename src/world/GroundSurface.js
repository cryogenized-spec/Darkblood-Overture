export function createGroundSurface(scene, worldWidth, groundY, groundHeight) {
  const surface = scene.add.graphics().setDepth(4).setScrollFactor(1, 1);

  surface.fillStyle(0x121017, 1);
  surface.fillRect(0, groundY, worldWidth, groundHeight);

  surface.fillStyle(0x2c2530, 1);
  surface.fillRect(0, groundY, worldWidth, 2);

  surface.fillStyle(0x1d1821, 1);
  for (let x = 0; x < worldWidth; x += 40) {
    surface.fillRect(x + 9, groundY + 8, 18, 1);
    surface.fillRect(x + 28, groundY + 13, 8, 1);
  }

  surface.fillStyle(0x3a3040, 0.55);
  for (let x = 0; x < worldWidth; x += 80) {
    surface.fillRect(x + 14, groundY + 4, 4, 1);
    surface.fillRect(x + 52, groundY + 16, 7, 1);
  }

  return surface;
}
