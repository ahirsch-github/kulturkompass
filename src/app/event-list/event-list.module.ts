import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EventListPageRoutingModule } from './event-list-routing.module';

import { EventListPage } from './event-list.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { TabsPageModule } from '../tabs/tabs.module';
import { TabsPage } from '../tabs/tabs.page';

@NgModule({
  imports: [
    EventListPageRoutingModule,
    SharedModuleModule,
    CommonModule,
  ],
  declarations: [EventListPage],
  providers: [DatePipe]
})
export class EventListPageModule {}
