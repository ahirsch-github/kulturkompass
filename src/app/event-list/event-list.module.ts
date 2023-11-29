import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

import { EventListPageRoutingModule } from './event-list-routing.module';

import { EventListPage } from './event-list.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    EventListPageRoutingModule,
    SharedModuleModule,
  ],
  declarations: [EventListPage],
  providers: [DatePipe]
})
export class EventListPageModule {}
