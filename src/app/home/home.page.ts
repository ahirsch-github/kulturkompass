import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
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
  eventCat: { 
    accessibilityPreferences?: string[], 
    eventCategories?: string[], 
    costs?: string[], 
    districts?: string[] 
  } | undefined = undefined;
  events: any;
  attractions: any;
  availableTags: any;
  page: number = 0;

  constructor(
    private modalCtrl: ModalController,
    private cookieService: CookieService,
    private kulturdatenService: KulturdatenService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.showQuestionnaireIfNeeded();
    this.loadEvents();
  }

  loadEvents() {
    const body = {inTheFuture:true, };
    this.kulturdatenService.getFutureEvents(278,this.page, body).subscribe(events => {
      this.events = events.data.events;
  
      // Create an array of observables
      const observables = this.events.map((event: any) => {
        return this.kulturdatenService.getAttractionById(event.attractions[0].referenceId).pipe(
          tap(attraction => {
            event.attraction = attraction.data.attraction;
          })
        );
      });
  
      // Use forkJoin to wait for all observables to complete
      forkJoin(observables).subscribe(() => {
        if (this.eventCat && this.eventCat.costs && this.eventCat.costs.includes('free')) {
          console.log('EventType: ', "free");
          this.events = this.events.filter((event: any) => event.admission && event.admission.ticketType === 'ticketType.freeOfCharge');
        }
      // filter events by Categorytags from questionnaire
      if (this.eventCat && this.eventCat.eventCategories && this.eventCat.eventCategories.length > 0) {
        this.events = this.events.filter((event: any) => {
          return event.attraction.tags.some((tag: any) => {
            const isTagIncluded = this.eventCat?.eventCategories?.includes(tag);
            return isTagIncluded;
          });
        });
      }

      // filter events by accessibilityTag from questionnaire
      if (this.eventCat && this.eventCat.accessibilityPreferences && this.eventCat.accessibilityPreferences.length > 0) {
        this.events = this.events.filter((event: any) => {
          return event.attraction.tags.some((tag: any) => {
            const isTagIncluded = this.eventCat?.accessibilityPreferences?.includes(tag);
            return isTagIncluded;
          });
        });
      }
        
        //console.log('Events: ', this.events);
        //console.log('Example Attraction: ', this.events[0].attraction);
        if (this.events && this.events.length < 1 && this.page < 10) {
          this.page += 1;
          this.loadEvents();
        }
      });
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
        this.loadEvents(); // reload the events after the questionnaire is dismissed
      });

      return await modal.present();
    } else {
      this.persolanizeEventCat();
    }
  }
}