/*
 * Copyright (c) 2019 by AlphaPulsar LLC.
 * All Rights Reserved.
 */

import {Component, OnInit} from '@angular/core';
import * as BABYLON from "babylonjs";

//=============================================================================

const DEFAULT_CAMERA_SPEED: number = 5;
const DEFAULT_CAMERA_ROLL_CORRECTION: number = 10;
const DEFAULT_CAMERA_OFFSET: number = 250;

const DEFAULT_LIGHT_INTENSITY: number = 0.75;

const AXIS_LINE_SIZE: number = 1e6;

const CANVAS_ID: string = "renderCanvas";

//=============================================================================

@Component({
  selector: 'alphapulsar-babylonjs-lib',
  templateUrl: './alphapulsar-babylonjs-lib.component.html',
  styleUrls: ['./alphapulsar-babylonjs-lib.component.scss']
})
export class AlphapulsarBabylonjsLibComponent implements OnInit {

  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.Camera;
  private _light: BABYLON.Light;

//=============================================================================

  constructor() {
  }

//=============================================================================

  ngOnInit() {
  }

//=============================================================================

  setRenderer(renderer: () => void): void {
    this._scene.registerBeforeRender(renderer);
  }

//=============================================================================

  createAnimation(sceneFunc: (bjsCanvasComponent: AlphapulsarBabylonjsLibComponent, scene: BABYLON.Scene) => void,
                  cameraFunc: (canvas: HTMLCanvasElement, scene: BABYLON.Scene) => BABYLON.Camera = AlphapulsarBabylonjsLibComponent.defaultFlyCamera,
                  lightFunc: (scene: BABYLON.Scene) => BABYLON.Light = AlphapulsarBabylonjsLibComponent.defaultHemisphericalLight,
                  axisFunc: (scene: BABYLON.Scene) => void = AlphapulsarBabylonjsLibComponent.defaultAxis
  ): void {

    // Get a ref to the <canvas> element.
    this._canvas = <HTMLCanvasElement>document.getElementById(CANVAS_ID);
    if (!this._canvas) {
      throw new Error(`AlphapulsarBabylonjsLibComponent cannot locate HTML canvas with id \"${CANVAS_ID}\".`);
    }

    // Engine and scene creation are axiomatic to this component.
    // If they need customization a factory or injection pattern s/b used.
    this._engine = new BABYLON.Engine(this._canvas, true);
    this._scene = new BABYLON.Scene(this._engine);
    this._engine.displayLoadingUI();

    // Camera creation can optionally be overridden.
    if (cameraFunc) {
      this._camera = cameraFunc(this._canvas, this._scene);
    }

    if (lightFunc) {
      this._light = lightFunc(this._scene);
    }

    if (axisFunc) {
      axisFunc(this._scene);
    }

    const thisCanvasComponent: AlphapulsarBabylonjsLibComponent = this; // Capture target for AlphapulsarBabylonjsLibComponent.this

    this._scene.executeWhenReady(function () {
      thisCanvasComponent._engine.hideLoadingUI();
    });

    this._engine.runRenderLoop(function () {
      thisCanvasComponent._scene.render();
    });

    // Resize
    window.addEventListener("resize", function () {
      thisCanvasComponent._engine.resize();
    });

    this._canvas.addEventListener("dblclick", function () {
      thisCanvasComponent._engine.switchFullscreen(true);
    });

    sceneFunc(this, this._scene);
  }

//=============================================================================

  static defaultFlyCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene, offset: number = DEFAULT_CAMERA_OFFSET) {
    const flyCamera: BABYLON.FlyCamera =
      new BABYLON.FlyCamera(
        AlphapulsarBabylonjsLibComponent.bjsId("_camera"),
        new BABYLON.Vector3(offset, offset, -offset),
        scene);

    flyCamera.setTarget(BABYLON.Vector3.Zero());
    flyCamera.attachControl(canvas, true);
    flyCamera.speed = DEFAULT_CAMERA_SPEED;

    // Airplane like rotation, with faster roll correction and banked-turns.
    // Default is 100. A higher number means slower correction.
    flyCamera.rollCorrect = DEFAULT_CAMERA_ROLL_CORRECTION;
    // Default is false.
    flyCamera.bankedTurn = true;
    // Defaults to 90° in radians in how far banking will roll the camera.
    flyCamera.bankedTurnLimit = Math.PI / 2;
    // How much of the Yawing (turning) will affect the Rolling (banked-turn.)
    // Less than 1 will reduce the Rolling, and more than 1 will increase it.
    flyCamera.bankedTurnMultiplier = 1;
    return flyCamera;
  }

//=============================================================================

  static defaultHemisphericalLight(scene: BABYLON.Scene): BABYLON.Light {
    const light: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", BABYLON.Vector3.Up(), scene);
    light.intensity = DEFAULT_LIGHT_INTENSITY;
    return light;
  }

//=============================================================================

  static defaultAxis(scene: BABYLON.Scene): void {
    BABYLON.Mesh.CreateLines("xaxis", [new BABYLON.Vector3(-AXIS_LINE_SIZE, 0, 0), new BABYLON.Vector3(AXIS_LINE_SIZE, 0, 0)], scene, false);
    BABYLON.Mesh.CreateLines("yaxis", [new BABYLON.Vector3(0, -AXIS_LINE_SIZE, 0), new BABYLON.Vector3(0, AXIS_LINE_SIZE, 0)], scene, false);
    BABYLON.Mesh.CreateLines("zaxis", [new BABYLON.Vector3(0, 0, -AXIS_LINE_SIZE), new BABYLON.Vector3(0, 0, AXIS_LINE_SIZE)], scene, false);
  }

//=============================================================================

  // noinspection JSUnusedGlobalSymbols
  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  // noinspection JSUnusedGlobalSymbols
  get engine(): BABYLON.Engine {
    return this._engine;
  }

  // noinspection JSUnusedGlobalSymbols
  get scene(): BABYLON.Scene {
    return this._scene;
  }

  // noinspection JSUnusedGlobalSymbols
  get camera(): BABYLON.Camera {
    return this._camera;
  }

  // noinspection JSUnusedGlobalSymbols
  set camera(value: BABYLON.Camera) {
    this._camera = value;
  }

  // noinspection JSUnusedGlobalSymbols
  get light(): BABYLON.Light {
    return this._light;
  }

  // noinspection JSUnusedGlobalSymbols
  set light(value: BABYLON.Light) {
    this._light = value;
  }

//=============================================================================

  /**
   * Public Helper function to create sequential "string"+"number" identifiers.
   * Use case is the "name" fields of BABYLONJS function calls that need unique
   * string ids. Could of used UUIDs but IMO their too heavy and opaque.
   *
   * @param idBase The string to which a unique number is appended.
   */
  static bjsId(idBase: string): string {
    return `${idBase}${++AlphapulsarBabylonjsLibComponent._bjsId}`;
  }

  /**
   * Counter for AlphapulsarBabylonjsLibComponent#bjsId
   */
  private static _bjsId = 0;
}
