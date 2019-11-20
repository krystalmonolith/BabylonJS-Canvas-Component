export class FrameRate {
  static readonly FRAMERATE_DTS: number = 1000;
  private _totalFrames: number;
  private _frameIndex: number;
  private _lastT: number;
  private _frameDTs: Array<number>;
  private _framesPerSecond: number = 30;   // The update rate in updates per second.

  constructor() {
    this._totalFrames = 0;
    this._lastT = Date.now();
    this._frameDTs = [];
    while (this._frameDTs.length < FrameRate.FRAMERATE_DTS) {
      this._frameDTs.push(this._framesPerSecond);
    }
    this.reset();
  }

  reset() {
    this._frameIndex = 0;
  }

  next() {
    ++this._totalFrames;
    return ++this._frameIndex;
  }

  calculateFrameRate(): FrameRate {
    const t: number = Date.now();
    let dT = t - this._lastT; // Milliseconds since last calculation.
    this._lastT = t;
    if (dT == 0) {
      dT = 1;
    }
    this._frameDTs.shift();
    this._frameDTs.push(dT);
    let tdT = this._frameDTs.reduce((acc, cv) => acc + cv);
    this._framesPerSecond = 1000 / tdT * this._frameDTs.length;
    if (this._totalFrames % FrameRate.FRAMERATE_DTS === 0) {
      console.log(`F:${this.toString()}`);
    }
    return this;
  }

  get frameIndex(): number {
    return this._frameIndex;
  }

  frameCount(secondsForAllFrames: number): number {
    return Math.floor(secondsForAllFrames * this._framesPerSecond);
  }

  isLastFrame(secondsForAllFrames: number): boolean {
    return this._frameIndex >= this.frameCount(secondsForAllFrames);
  }

  toString(): string {
    return `fps:${this._framesPerSecond.toPrecision(5)} bufferSize:${this._frameDTs.length}`;
  }
}
