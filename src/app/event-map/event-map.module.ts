import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventMapPageRoutingModule } from './event-map-routing.module';

import { EventMapPage } from './event-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventMapPageRoutingModule
  ],
  declarations: [EventMapPage]
})
export class EventMapPageModule {}
