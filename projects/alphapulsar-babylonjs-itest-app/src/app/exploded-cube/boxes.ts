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

import * as BABYLON from 'babylonjs';
import {Box} from './box';
import {BOX_SIZE, BOXES_PER_SIDE} from './constant';

export class Boxes {
  private _boxes: Array<Box>;

  constructor(scene: BABYLON.Scene) {
    Box.initStaticMaterials(scene);
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
