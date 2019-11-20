import {Component, OnInit, ViewChild} from '@angular/core';
import {ExplodedCubeRenderer} from './exploded-cube-renderer';
import {AlphapulsarBabylonjsLibComponent} from '../../../../alphapulsar-babylonjs-lib/src/public-api';


@Component({
  selector: 'bjs-exploded-cube',
  templateUrl: './exploded-cube.component.html',
  styleUrls: ['./exploded-cube.component.scss']
})
export class ExplodedCubeComponent implements OnInit {
  @ViewChild('explodedcubecanvas', {static: true}) private bjsCanvasComponent: AlphapulsarBabylonjsLibComponent;

  constructor() {
  }

  ngOnInit() {
    const explodedCubeRenderer: ExplodedCubeRenderer = new ExplodedCubeRenderer();
    this.bjsCanvasComponent.createAnimation(explodedCubeRenderer.createExplodedCubeRenderer.bind(explodedCubeRenderer));
  }
}
