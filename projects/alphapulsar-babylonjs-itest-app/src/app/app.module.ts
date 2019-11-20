import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AlphapulsarBabylonjsLibModule} from '../../../alphapulsar-babylonjs-lib/src/lib/alphapulsar-babylonjs-lib.module';

@NgModule({
  declarations: [
    AppComponent
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
