import {FrameRate} from '../common';
import {SECONDS_PER_CYCLE, SECONDS_PER_TURN} from './constant';

export class FrameController extends FrameRate {

  constructor() {
    super();
  }

  get framesPerCycle(): number {
    return this.frameCount(SECONDS_PER_CYCLE);
  }

  get framesPerTurn(): number {
    return this.frameCount(SECONDS_PER_TURN);
  }

  get isLastCycle(): boolean {
    return this.isLastFrame(SECONDS_PER_CYCLE);
  }

  get isLastTurn(): boolean {
    return this.isLastFrame(SECONDS_PER_TURN);
  }

  toString(): string {
    return super.toString() + ` fpc:${this.framesPerCycle} fpt:${this.framesPerTurn} ${this.isLastCycle}:${this.isLastTurn}`;
  }
}
