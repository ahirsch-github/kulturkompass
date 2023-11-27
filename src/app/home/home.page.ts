import { Component, OnInit } from '@angular/core';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire.component';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  eventCat: string | 'test' | undefined;

  constructor(
    private modalCtrl: ModalController,
    private cookieService: CookieService,
  ) {}

  ngOnInit() {
    this.showQuestionnaireIfNeeded()
  }
  
  private persolanizeEventCat() {
    const preferences = this.cookieService.get('userType');
      console.log('Preferences: ', preferences);
      this.eventCat = preferences;
  }
  
  private async showQuestionnaireIfNeeded() {
    console.log('Checking if questionnaire is needed');
    const isFirstTime = localStorage.getItem('hasVisited') === null;
    if (isFirstTime) {
      const modal = await this.modalCtrl.create({
      component: QuestionnaireComponent
    });
    
    modal.onDidDismiss().then((data) => {
      this.persolanizeEventCat();
    });

    return await modal.present();
    } else {
      this.persolanizeEventCat();
    }
  }
}