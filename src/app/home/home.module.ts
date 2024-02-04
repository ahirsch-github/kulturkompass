import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { DatePipe } from '@angular/common';


import { HomePageRoutingModule } from './home-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire.component';
import { CookieBannerComponent } from '../components/cookie-banner/cookie-banner.component';


@NgModule({
  imports: [
    HomePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule,
    CommonModule,
  ],
  declarations: [HomePage, QuestionnaireComponent, CookieBannerComponent],
  providers: [DatePipe]
})
export class HomePageModule {}
