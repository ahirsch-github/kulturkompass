import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { EventListPageRoutingModule } from './event-list-routing.module';

import { EventListPage } from './event-list.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { FilterMenuComponent } from '../components/filter-menu/filter-menu.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    EventListPageRoutingModule,
    SharedModuleModule,
    CommonModule,
    FormsModule
  ],
  declarations: [EventListPage, FilterMenuComponent],
  providers: [DatePipe]
})
export class EventListPageModule {}
