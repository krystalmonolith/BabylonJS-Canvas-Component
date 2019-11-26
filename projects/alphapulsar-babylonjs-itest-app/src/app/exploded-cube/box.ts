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
import {AxisEnum} from './axis-enum';
import {
  BOX_MAX_ANGULAR_RATE,
  BOX_MAX_DELTA_ANGULAR_RATE,
  BOX_ROTATION_MAX_RADIANS,
  BOX_SIZE,
  TURN_ANGLE_RADIANS
} from './constant';
import {minMax, minMaxV3, randAxis, randc} from '../common';
import {FrameController} from './frame-controller';

export class Box {
  private static materialInitialized = false;
  private static matRed: BABYLON.StandardMaterial;
  private static matGreen: BABYLON.StandardMaterial;
  private static matBlue: BABYLON.StandardMaterial;
  private static matYellow: BABYLON.StandardMaterial;
  private static matCyan: BABYLON.StandardMaterial;
  private static nameIndex = 0;

  private static matWhite: BABYLON.StandardMaterial;
  private _mesh: BABYLON.Mesh;
  private _basePosition: BABYLON.Vector3;
  private _rotationRandom: BABYLON.Vector3;
  private _rotationTurn: BABYLON.Vector3;
  private readonly _rotationRate: BABYLON.Vector3;

  private _turnAxis: AxisEnum;

  constructor(mesh: BABYLON.Mesh, basePosition: BABYLON.Vector3, scene: BABYLON.Scene) {
    this._mesh = mesh;
    this._basePosition = basePosition;
    this._rotationRandom = BABYLON.Vector3.Zero();
    this._rotationTurn = BABYLON.Vector3.Zero();
    this._rotationRate = BABYLON.Vector3.Zero();
    this._turnAxis = AxisEnum.X;
    Box.initStaticMaterials(scene);
  }

  static initStaticMaterials(scene: BABYLON.Scene): void {
    if (!Box.materialInitialized) {
      Box.materialInitialized = true;
      Box.matRed = new BABYLON.StandardMaterial('mat_red', scene);
      Box.matRed.diffuseColor = new BABYLON.Color3(1, 0, 0);
      Box.matRed.specularColor = new BABYLON.Color3(0, 1, 1);

      Box.matGreen = new BABYLON.StandardMaterial('mat_green', scene);
      Box.matGreen.diffuseColor = new BABYLON.Color3(0, 1, 0);
      Box.matGreen.specularColor = new BABYLON.Color3(.5, 1, .5);

      Box.matBlue = new BABYLON.StandardMaterial('mat_blue', scene);
      Box.matBlue.diffuseColor = new BABYLON.Color3(0, 0, 1);
      Box.matBlue.specularColor = new BABYLON.Color3(1, 1, 0);

      Box.matYellow = new BABYLON.StandardMaterial('mat_yellow', scene);
      Box.matYellow.diffuseColor = new BABYLON.Color3(1, 1, 0);
      Box.matYellow.specularColor = new BABYLON.Color3(0, 0, 1);

      Box.matCyan = new BABYLON.StandardMaterial('mat_cyan', scene);
      Box.matCyan.diffuseColor = new BABYLON.Color3(0, 1, 1);
      Box.matCyan.specularColor = new BABYLON.Color3(1, 0, 0);

      Box.matWhite = new BABYLON.StandardMaterial('mat_white', scene);
      Box.matWhite.diffuseColor = new BABYLON.Color3(1, 1, 1);
      Box.matWhite.specularColor = new BABYLON.Color3(0, 0, 0);
    }
  }

  static disposeStaticMaterials(): void {
    if (Box.materialInitialized) {
      Box.materialInitialized = false;
      Box.matRed.dispose();
      Box.matRed = null;
      Box.matGreen.dispose();
      Box.matGreen = null;
      Box.matBlue.dispose();
      Box.matBlue = null;
      Box.matYellow.dispose();
      Box.matYellow = null;
      Box.matCyan.dispose();
      Box.matCyan = null;
      Box.matWhite.dispose();
      Box.matWhite = null;
    }
  }

  private static randa(v: number): number {
    return minMax(v + randc(BOX_MAX_DELTA_ANGULAR_RATE), -BOX_MAX_ANGULAR_RATE, BOX_MAX_ANGULAR_RATE);
  }
  static createBox(basePosition: BABYLON.Vector3, scene: BABYLON.Scene): Box {
    const boxMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(`box${Box.nameIndex++}`, {size: BOX_SIZE}, scene);
    boxMesh.showBoundingBox = false;

    const multi = new BABYLON.MultiMaterial('mm1', scene);
    multi.subMaterials.push(Box.matRed);
    multi.subMaterials.push(Box.matGreen);
    multi.subMaterials.push(Box.matBlue);
    multi.subMaterials.push(Box.matYellow);
    multi.subMaterials.push(Box.matCyan);
    multi.subMaterials.push(Box.matWhite);

    boxMesh.subMeshes = [];
    const verticesCount = boxMesh.getTotalVertices();

    boxMesh.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, boxMesh));
    boxMesh.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, boxMesh));
    boxMesh.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, boxMesh));
    boxMesh.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, boxMesh));
    boxMesh.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, boxMesh));
    boxMesh.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, boxMesh));

    boxMesh.material = multi;

    return new Box(boxMesh, basePosition, scene);
  }

  get turnAxis(): AxisEnum {
    return this._turnAxis;
  }

  set turnAxis(v: AxisEnum) {
    this._turnAxis = v;
  }

  randomAxis(): void {
    this.turnAxis = randAxis();
  }

  turnAngleVector(frameIndex: number, frameRate: FrameController) {
    const turnAngle: number = TURN_ANGLE_RADIANS * frameIndex / frameRate.framesPerTurn * (Math.sign(this._turnAxis) >= 0 ? 1.0 : -1.0);
    let av: BABYLON.Vector3;
    switch (Math.abs(this._turnAxis)) {
      case AxisEnum.X:
        av = new BABYLON.Vector3(turnAngle, 0, 0);
        break;
      case AxisEnum.Y:
        av = new BABYLON.Vector3(0, turnAngle, 0);
        break;
      case AxisEnum.Z:
        av = new BABYLON.Vector3(0, 0, turnAngle);
        break;
      default:
        throw new Error(`Invalid axis number ${this.turnAxis} @ frameIndex ${frameIndex}`);
    }
    return av;
  }

  addTurnVector(frameRate: FrameController): void {
    this._rotationTurn.addInPlace(this.turnAngleVector(frameRate.framesPerTurn, frameRate));
  }

  setMesh(translationScale: number, randomRotationScale: number, rotationOffset: BABYLON.Vector3): void {
    this._mesh.position = this._basePosition.scale(translationScale);
    this._mesh.rotation = this._rotationRandom.scale(randomRotationScale).add(this._rotationTurn).add(rotationOffset);
  }

  updateRandomRate(): void {
    this._rotationRate.x = Box.randa(this._rotationRate.x);
    this._rotationRate.y = Box.randa(this._rotationRate.y);
    this._rotationRate.z = Box.randa(this._rotationRate.z);
    this._rotationRandom.addInPlace(this._rotationRate);
    this._rotationRandom = minMaxV3(this._rotationRandom, -BOX_ROTATION_MAX_RADIANS, BOX_ROTATION_MAX_RADIANS);
  }

}
