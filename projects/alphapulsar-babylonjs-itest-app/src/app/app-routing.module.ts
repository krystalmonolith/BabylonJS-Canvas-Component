import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlphapulsarBabylonjsLibComponent} from '../../../alphapulsar-babylonjs-lib/src/lib/alphapulsar-babylonjs-lib.component';


const routes: Routes = [
  { path: '', component: AlphapulsarBabylonjsLibComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
