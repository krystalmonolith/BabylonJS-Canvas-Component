import * as BABYLON from "babylonjs";
import {Box} from './box';
import {BOX_SIZE, BOXES_PER_SIDE} from './constant';

export class Boxes {
  private _boxes: Array<Box>;

  constructor(scene: BABYLON.Scene) {
    Box.initMaterials(scene);
    this._boxes = [];
    const bS: number = (BOXES_PER_SIDE * BOX_SIZE) / 2;
    const box2 = BOX_SIZE / 2.0;
    for (let xi = 0; xi < BOXES_PER_SIDE; xi++) {
      const x = xi * BOX_SIZE - bS;
      for (let yi = 0; yi < BOXES_PER_SIDE; yi++) {
        const y = yi * BOX_SIZE - bS;
        for (let zi = 0; zi < BOXES_PER_SIDE; zi++) {
          const z = zi * BOX_SIZE - bS;
          const p: BABYLON.Vector3 = new BABYLON.Vector3(x + box2, y + box2, z + box2);
          this._boxes.push(Box.createBox(p, scene));
        }
      }
    }
  }

  forEach(proc: (box: Box, index?: number, a?: Box[]) => void) {
    this._boxes.forEach((box, index, array) => proc(box, index, array));
  }

}
