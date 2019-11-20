import * as BABYLON from "babylonjs";
import {AlphapulsarBabylonjsLibComponent} from '../../../../alphapulsar-babylonjs-lib/src/public-api.js';
import {Boxes} from './boxes';
import {FrameController} from './frame-controller';
import {RenderState} from './render-state';
import {CYCLE_PAUSE_DELAY_MSEC, RANDOM_SINE_TRANSLATION_SCALING, TURN_SINE_TRANSLATION_SCALING} from './constant';

export class ExplodedCubeRenderer {
  private boxes: Boxes;
  private renderState: RenderState;
  private frameController: FrameController;

  constructor() {
  }

  createExplodedCubeRenderer(AlphapulsarBabylonjsLibComponent: AlphapulsarBabylonjsLibComponent, scene: BABYLON.Scene): void {
    this.boxes = new Boxes(scene);
    this.frameController = new FrameController();
    this.renderState = RenderState.RENDER_CUBE_EXPAND_COLLAPSE;
    AlphapulsarBabylonjsLibComponent.setRenderer(this.renderExplodingCube(this.renderState, this.frameController));
  }

  private renderExplodingCube(renderState: RenderState, fc: FrameController) {
    // The rendering function returned here is eventually passed to BABYLON.Scene.registerBeforeRender()
    // and gets repeatedly executed by a BABYLON.Engine.runRenderLoop() squirrel cage.
    return () => {
      switch (renderState) {
        case RenderState.RENDER_CUBE_EXPAND_COLLAPSE:
          const scaleCube = Math.sin(Math.PI * 2.0 * fc.frameIndex / fc.framesPerCycle - Math.PI / 2) / 2 + 0.5;
          const translationScaleCube = scaleCube * (RANDOM_SINE_TRANSLATION_SCALING - 1) + 1;
          this.boxes.forEach((box) => {
            box.updateRandomRate();
            box.setMesh(translationScaleCube, scaleCube, BABYLON.Vector3.Zero());
          });

          fc.next();
          if (fc.isLastCycle) {
            fc.reset();
            renderState = RenderState.PAUSE_BEFORE_ROTATION; // ST0
          }
          break;

        case RenderState.PAUSE_BEFORE_ROTATION:
          setTimeout(() => {
            this.boxes.forEach((box) => {
              box.randomAxis();
              box.setMesh(1.0, 0.0, BABYLON.Vector3.Zero());
            });
            renderState = RenderState.RENDER_BOX_ROTATION; // ST2
          }, CYCLE_PAUSE_DELAY_MSEC);
          renderState = RenderState.PAUSED; // ST1
          break;

        case RenderState.RENDER_BOX_ROTATION:
          if (!fc.isLastTurn) {
            const scaleTurn = Math.sin(Math.PI * 2.0 * fc.frameIndex / fc.framesPerTurn - Math.PI / 2) / 2 + 0.5;
            const translationScaleTurn = scaleTurn * (TURN_SINE_TRANSLATION_SCALING - 1) + 1;
            this.boxes.forEach((box) => {
              box.setMesh(translationScaleTurn, 0.0, box.turnAngleVector(fc.frameIndex, fc));
            });
            fc.next();
          } else {
            this.boxes.forEach((box) => {
              box.addTurnVector(fc);
              box.setMesh(1.0, 0.0, BABYLON.Vector3.Zero());
            });
            renderState = RenderState.PAUSE_AFTER_ROTATION; // ST3
            fc.reset();
          }
          break;

        case RenderState.PAUSE_AFTER_ROTATION:
          setTimeout(() => {
            renderState = RenderState.RENDER_CUBE_EXPAND_COLLAPSE; // ST5
          }, CYCLE_PAUSE_DELAY_MSEC);
          renderState = RenderState.PAUSED; // ST4
          break;

        case RenderState.PAUSED:
          break;
      }
      fc.calculateFrameRate();
    }
  }
}
