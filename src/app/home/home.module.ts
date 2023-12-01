import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire.component';


@NgModule({
  imports: [
    HomePageRoutingModule,
    ReactiveFormsModule,
    SharedModuleModule
  ],
  declarations: [HomePage, QuestionnaireComponent],
})
export class HomePageModule {}
