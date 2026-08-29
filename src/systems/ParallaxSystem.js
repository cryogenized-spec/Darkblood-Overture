/**
 * Future Level 01 parallax controller.
 *
 * The first level will use three visual planes:
 *   far  — rearmost atmosphere / castle silhouette
 *   mid  — environmental structures
 *   near — foreground terrain / graves / effects
 *
 * Pass 1 deliberately contains no movement implementation.
 */
export class ParallaxSystem {
  constructor() {
    this.planes = {
      far: null,
      mid: null,
      near: null,
    };
  }

  setPlane(name, layer) {
    if (!(name in this.planes)) throw new Error(`Unknown parallax plane: ${name}`);
    this.planes[name] = layer;
  }

  update(_worldDeltaX) {
    // Reserved for the next gameplay pass.
  }
}
