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

/**
 * Angular BabylonJS Canvas Component
 *
 * General Usage:
 *
 * The <babylonjs-canvas> was not designed to be used directly: It was designed to be encapsulated in another
 * Angular component that provides a "render function". The render function is the function passed to the
 * BABYLON.scene.registerBeforeRender(function() {}) BabylonJS registration function.
 * @see <a href="https://doc.babylonjs.com/babylon101/animations#complex-animation">Complex animation</a>
 *
 * 1.) Embed the <babylonjs-canvas> component selector in your component's template.
 *
 * 2.) Use ViewChild to get a reference to the canvas component element and type it as BabylonjsCanvasComponent.
 * !!! IMPORTANT: Use { static: true } as the ViewChild second parameter. !!! .e.g:
 *   @ViewChild('explodedcubecanvas', {static: true}) private bjsCanvasComponent: BabylonjsCanvasComponent;
 *
 * 3.) In the NgInit() function of your component create the WebGL context by using the
 * BabylonjsCanvasComponent.createAnimation() function. The createAnimation() function first initializes
 * the BABYLON.Engine and BABYLON.Scene and then invokes a callback function you supply that returns
 * the actual BabylonJS render function having the TypeScript signature: () => void.
 * After your function return the render function it is registered with BabylonJS render loop.
 * Default camera, light, and axis functions are supplied of none are specified
 * when calling BabylonjsCanvasComponent.createAnimation().
 *
 * 4.) Create frame-by-frame animations inside your render function using the BABYLON.Scene parameter passed
 * to the rendering function creation callback which should capture the BABYLON.Scene parameter!
 *
 * Cavaets:
 *
 * 1.) It was necessary to have the explicit initialization function BabylonjsCanvasComponent.createAnimation()
 * because the embedded BabylonjsCanvasComponent is created before your encapsulating component is created causing
 * chicken/egg issues.
 *
 * 2.) Only one canvas per page is currently supported: Experiments with multiple BabylonjsCanvasComponent embedded
 * into one parent component's HTML caused issues with the binding of the WASD view manipulation keys .aka.
 * they ceased working. This might be overcome by using the "BabylonJS Observables" but that was
 * out of scope for my effort.
 */


import {Component, OnInit} from '@angular/core';
import * as BABYLON from "babylonjs";

//=============================================================================

@Component({
  selector: 'babylonjs-canvas',
  templateUrl: './babylonjs-canvas.component.html',
  styleUrls: ['./babylonjs-canvas.component.scss']
})
export class BabylonjsCanvasComponent {

  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.Camera;
  private _light: BABYLON.Light;

//=============================================================================

  constructor() {
  }

//=============================================================================

  createAnimation(sceneFunc: (bjsCanvasComponent: BabylonjsCanvasComponent, scene: BABYLON.Scene) => () => void,
                  cameraFunc: (canvas: HTMLCanvasElement, scene: BABYLON.Scene) => BABYLON.Camera = BabylonjsCanvasComponent.defaultFlyCamera,
                  lightFunc: (scene: BABYLON.Scene) => BABYLON.Light = BabylonjsCanvasComponent.defaultHemisphericalLight,
                  axisFunc: (scene: BABYLON.Scene) => void = BabylonjsCanvasComponent.defaultAxis
  ): void {

    // Get a ref to the <canvas> element.
    this._canvas = <HTMLCanvasElement>document.getElementById(CANVAS_ID);
    if (!this._canvas) {
      throw new Error(`BabylonjsCanvasComponent cannot locate HTML canvas with id \"${CANVAS_ID}\".`);
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

    const thisCanvasComponent: BabylonjsCanvasComponent = this; // Capture target for BabylonjsCanvasComponent.this

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

    // Invoke the user supplied function that should create and return a
    // render function using the supplied BABYLON.Scene parameter.
    this._scene.registerBeforeRender(sceneFunc(this, this._scene));
  }

//=============================================================================

  static defaultFlyCamera(canvas: HTMLCanvasElement, scene: BABYLON.Scene, offset: number = DEFAULT_CAMERA_OFFSET) {
    const flyCamera: BABYLON.FlyCamera =
      new BABYLON.FlyCamera(
        BabylonjsCanvasComponent.bjsId("_camera"),
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
    return `${idBase}${++BabylonjsCanvasComponent._bjsId}`;
  }

  /**
   * Counter for BabylonjsCanvasComponent#bjsId
   */
  private static _bjsId = 0;
}

//=============================================================================

const DEFAULT_CAMERA_SPEED: number = 5;
const DEFAULT_CAMERA_ROLL_CORRECTION: number = 10;
const DEFAULT_CAMERA_OFFSET: number = 250;

const DEFAULT_LIGHT_INTENSITY: number = 0.75;

const AXIS_LINE_SIZE: number = 1e6;

const CANVAS_ID: string = "renderCanvas";

