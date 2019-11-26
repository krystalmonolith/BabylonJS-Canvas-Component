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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BabylonjsCanvasComponent} from '../../../../alphapulsar-babylonjs-lib/src/lib/babylonjs-canvas.component';
import * as BABYLON from 'babylonjs';
import {interval, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

// Experiment with changing the constants below and observe the resultant visual differences.

const UPDATE_PERIOD_MILLISECONDS = 10;  // How often the screen updates.
const RENDER_STEPS = 250; // How many steps in the sphere's animation cycle.
const SPHERE_RADIUS = 10; // Scaling the image... Try 1 and 1000.. Any difference?

@Component({
  selector: 'app-hello-sphere',
  templateUrl: './hello-sphere.component.html',
  styleUrls: ['./hello-sphere.component.scss']
})
export class HelloSphereComponent implements OnInit, OnDestroy {
  @ViewChild('babylonjsCanvas', { static: true })
  private babylonjsCanvas: BabylonjsCanvasComponent;
  private initScene = true;
  private subscription: Subscription;

  constructor() {}

  private sceneFunc(canvasComponent: BabylonjsCanvasComponent, scene: BABYLON.Scene): () => void {
    // Return the "Scene Rendering Function" .aka. the 'sceneFunc';
    return () => {
      // YOU CAN CLOSE ON INPUT PARAMETER(s) TO YOUR RENDERER HERE!
      if (this.initScene) {
        this.initScene = false; // Only create the scene once for this example... YMMV.

        // Add the sphere to the scene.
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { segments: 16, diameter: SPHERE_RADIUS * 2 }, scene);

        // Add a square ground plane 10x sphere radius.
        BABYLON.MeshBuilder.CreateGround('ground1', { height: SPHERE_RADIUS * 10, width: SPHERE_RADIUS * 10, subdivisions: 2 }, scene);

        // Use RxJS to update the vertical position of the sphere
        // based on a half wave sine function every UPDATE_PERIOD_MILLISECONDS.
        this.subscription = interval(UPDATE_PERIOD_MILLISECONDS) // Generates 0..MAX_INT steps...
          .pipe(map(step => step % RENDER_STEPS)) // Modulus generates 0..RENDER_STEPS step counts repeatedly...
          // Lambda below modifies y coordinate of sphere based on a half wave sine function iterated by the repeating step count.
          .subscribe(step => (sphere.position.y = SPHERE_RADIUS + 50 * Math.abs(Math.cos(step * 2 * Math.PI / RENDER_STEPS))));
      }
      return scene; // Always return scene whether is it modified or not.
    };
  }

  ngOnInit() {
    // Note the bind(this) below...
    // Must pass the current instance reference to the sceneFunc class method being returned
    // or "this" will be null inside the sceneFunc!
    this.babylonjsCanvas.createAnimation(this.sceneFunc.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up RxJS subscription.
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
