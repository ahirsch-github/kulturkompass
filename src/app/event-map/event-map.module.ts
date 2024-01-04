import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventMapPageRoutingModule } from './event-map-routing.module';

import { EventMapPage } from './event-map.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { LocationModalComponent } from '../components/location-modal/location-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventMapPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [EventMapPage, LocationModalComponent]
})
export class EventMapPageModule {}
