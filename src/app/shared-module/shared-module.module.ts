import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { KulturdatenService } from '../services/kulturdaten.service';
import { TabsPageModule } from '../tabs/tabs.module';



@NgModule({
  declarations: [SearchBarComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule
  ],
  exports: [SearchBarComponent, IonicModule],
  providers: [KulturdatenService]
})
export class SharedModuleModule { }
