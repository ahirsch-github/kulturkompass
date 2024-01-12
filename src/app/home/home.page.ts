import { Component, OnInit } from '@angular/core';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire.component';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { KulturdatenService } from '../services/kulturdaten.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  eventCat: { eventTopics?: string[], eventTypes?: string[], costs?: string[], districts?: string[] } | undefined = undefined;
  events: any;

  constructor(
    private modalCtrl: ModalController,
    private cookieService: CookieService,
    private kulturdatenService: KulturdatenService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.showQuestionnaireIfNeeded()
    const body = {inTheFuture:true, };
    this.kulturdatenService.getFutureEvents(278, body).subscribe(events => {
      this.events = events;
      console.log('Events: ', this.events);
    });

  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }
  
  formatTime(time: string): string {
    return time.substr(0, 5) || '';
  }
  
  private persolanizeEventCat() {
    const userTypeCookie = this.cookieService.get('userType');
    if (userTypeCookie) {
      const preferences = JSON.parse(userTypeCookie);
      console.log('Preferences: ', preferences);
      this.eventCat = preferences;
    } else {
      console.log('userType cookie is not set');
    }
  }
  
  private async showQuestionnaireIfNeeded() {
    console.log('Checking if questionnaire is needed');
    const isFirstTime = localStorage.getItem('hasVisited') === null;
    if (1==1) { //TODO: change to isFirstTime for production
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