import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AlphapulsarBabylonjsLibModule} from '../../../alphapulsar-babylonjs-lib/src/public-api';
import {ExplodedCubeComponent} from './exploded-cube/exploded-cube.component';

@NgModule({
  declarations: [
    AppComponent,
    ExplodedCubeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AlphapulsarBabylonjsLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
