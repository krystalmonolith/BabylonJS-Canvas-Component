/*
 * MIT License
 *
 * Copyright 2019 AlphaPulsar LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 */

export class FrameRate {
  static readonly FRAMERATE_DTS: number = 1000;
  private _totalFrames: number;
  private _frameIndex: number;
  private _lastT: number;
  private _frameDTs: Array<number>;
  private _framesPerSecond = 30;   // The update rate in updates per second.

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
    if (dT === 0) {
      dT = 1;
    }
    this._frameDTs.shift();
    this._frameDTs.push(dT);
    const tdT = this._frameDTs.reduce((acc, cv) => acc + cv);
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
