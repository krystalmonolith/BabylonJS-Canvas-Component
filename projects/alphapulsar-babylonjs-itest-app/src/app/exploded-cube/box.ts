import * as BABYLON from "babylonjs";
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
    Box.initMaterials(scene);
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
    let a: number = TURN_ANGLE_RADIANS * frameIndex / frameRate.framesPerTurn * (Math.sign(this._turnAxis) >= 0 ? 1.0 : -1.0);
    let av: BABYLON.Vector3;
    switch (Math.abs(this._turnAxis)) {
      case AxisEnum.X:
        av = new BABYLON.Vector3(a, 0, 0);
        break;
      case AxisEnum.Y:
        av = new BABYLON.Vector3(0, a, 0);
        break;
      case AxisEnum.Z:
        av = new BABYLON.Vector3(0, 0, a);
        break;
      default:
        throw(`Invalid axis number ${this.turnAxis} @ frameIndex ${frameIndex}`)
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

  private static randa(v: number): number {
    return minMax(v + randc(BOX_MAX_DELTA_ANGULAR_RATE), -BOX_MAX_ANGULAR_RATE, BOX_MAX_ANGULAR_RATE);
  }

  updateRandomRate(): void {
    this._rotationRate.x = Box.randa(this._rotationRate.x);
    this._rotationRate.y = Box.randa(this._rotationRate.y);
    this._rotationRate.z = Box.randa(this._rotationRate.z);
    this._rotationRandom.addInPlace(this._rotationRate);
    this._rotationRandom = minMaxV3(this._rotationRandom, -BOX_ROTATION_MAX_RADIANS, BOX_ROTATION_MAX_RADIANS);
  }

  private static nameIndex: number = 0;

  static createBox(basePosition: BABYLON.Vector3, scene: BABYLON.Scene): Box {
    const boxMesh: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox(`box${Box.nameIndex++}`, {size: BOX_SIZE}, scene);
    boxMesh.showBoundingBox = false;

    const multi = new BABYLON.MultiMaterial("mm1", scene);
    multi.subMaterials.push(Box.mat_red);
    multi.subMaterials.push(Box.mat_green);
    multi.subMaterials.push(Box.mat_blue);
    multi.subMaterials.push(Box.mat_yellow);
    multi.subMaterials.push(Box.mat_cyan);
    multi.subMaterials.push(Box.mat_white);

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

  private static mat_red: BABYLON.StandardMaterial;
  private static mat_green: BABYLON.StandardMaterial;
  private static mat_blue: BABYLON.StandardMaterial;
  private static mat_yellow: BABYLON.StandardMaterial;
  private static mat_cyan: BABYLON.StandardMaterial;
  private static mat_white: BABYLON.StandardMaterial;

  private static materialInitialized = false;

  static initMaterials(scene: BABYLON.Scene): void {
    if (!Box.materialInitialized) {
      Box.materialInitialized = true;
      Box.mat_red = new BABYLON.StandardMaterial("mat_red", scene);
      Box.mat_red.diffuseColor = new BABYLON.Color3(1, 0, 0);
      Box.mat_red.specularColor = new BABYLON.Color3(0, 1, 1);

      Box.mat_green = new BABYLON.StandardMaterial("mat_green", scene);
      Box.mat_green.diffuseColor = new BABYLON.Color3(0, 1, 0);
      Box.mat_green.specularColor = new BABYLON.Color3(.5, 1, .5);

      Box.mat_blue = new BABYLON.StandardMaterial("mat_blue", scene);
      Box.mat_blue.diffuseColor = new BABYLON.Color3(0, 0, 1);
      Box.mat_blue.specularColor = new BABYLON.Color3(1, 1, 0);

      Box.mat_yellow = new BABYLON.StandardMaterial("mat_yellow", scene);
      Box.mat_yellow.diffuseColor = new BABYLON.Color3(1, 1, 0);
      Box.mat_yellow.specularColor = new BABYLON.Color3(0, 0, 1);

      Box.mat_cyan = new BABYLON.StandardMaterial("mat_cyan", scene);
      Box.mat_cyan.diffuseColor = new BABYLON.Color3(0, 1, 1);
      Box.mat_cyan.specularColor = new BABYLON.Color3(1, 0, 0);

      Box.mat_white = new BABYLON.StandardMaterial("mat_white", scene);
      Box.mat_white.diffuseColor = new BABYLON.Color3(1, 1, 1);
      Box.mat_white.specularColor = new BABYLON.Color3(0, 0, 0);
    }
  }
}
