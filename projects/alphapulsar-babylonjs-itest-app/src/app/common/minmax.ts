import * as BABYLON from "babylonjs";

export function minMax(v: number, min: number, max: number): number {
  return Math.max(Math.min(v, max), min);
}

export function minMaxV3(v: BABYLON.Vector3, min: number, max: number): BABYLON.Vector3 {
  return new BABYLON.Vector3(
    minMax(v.x, min, max),
    minMax(v.y, min, max),
    minMax(v.z, min, max));
}
