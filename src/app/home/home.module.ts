import { NgModule } from '@angular/core';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';


@NgModule({
  imports: [
    HomePageRoutingModule,
    SharedModuleModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
