import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ExplodedCubeComponent} from './exploded-cube/exploded-cube.component';


const routes: Routes = [
  { path: '', component: ExplodedCubeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
