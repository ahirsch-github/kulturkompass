import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { KulturdatenService } from '../services/kulturdaten.service';
import { EventDetailComponent } from '../components/event-detail/event-detail.component';



/**
 * The SharedModuleModule is a module that contains shared components, services, and modules
 * that can be used across multiple modules in the application.
 */
@NgModule({
  declarations: [SearchBarComponent, EventDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule
  ],
  exports: [SearchBarComponent, IonicModule, EventDetailComponent],
  providers: [KulturdatenService]
})
export class SharedModuleModule { }
