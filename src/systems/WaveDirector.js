/**
 * Future Level 01 wave director.
 *
 * Waves will be data-defined and their threat will escalate over time.
 * Enemy *waves* are not driven here yet — the first skeleton patrol is a
 * separate, timed SkeletonDirector socket (see systems/SkeletonDirector.js).
 */
export class WaveDirector {
  constructor(definitions = []) {
    this.definitions = definitions;
    this.currentIndex = -1;
  }

  startNextWave() {
    if (this.currentIndex + 1 >= this.definitions.length) return null;
    this.currentIndex += 1;
    return this.definitions[this.currentIndex];
  }

  get threatLevel() {
    return this.currentIndex < 0 ? 0 : this.definitions[this.currentIndex]?.threatLevel ?? 0;
  }
}
