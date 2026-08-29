/**
 * Future Level 01 wave director.
 *
 * Waves will be data-defined and their threat will escalate over time.
 * No enemy spawning is performed in Pass 1.
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
