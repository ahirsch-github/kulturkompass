import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire.component';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { KulturdatenService } from '../services/kulturdaten.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EventDetailComponent } from '../components/event-detail/event-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  eventCat: { 
    accessibilityPreferences?: string[], 
    eventCategories?: string[], 
    costs?: boolean, 
    boroughPreferences?: string[] 
  } | undefined = undefined;
  events: any;
  attractions: any;
  availableTags: any;
  page: number = 0;
  isPersonalized: boolean = false;
  isLoading = false;
  idsToFilter: string[] = [];

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
    this.isLoading = true;
    const locationIds: string[] = [];
    const accessibilityIds = this.eventCat?.accessibilityPreferences || [];
    const boroughs = this.eventCat?.boroughPreferences || [];
    this.kulturdatenService.searchLocationsByBoroughAndTag(boroughs, accessibilityIds).subscribe(response => {
      locationIds.push(...response.data.locations.map((location: any) => location.identifier));
        
      const attractionTags: string[] = [];
      attractionTags.push(...this.eventCat?.eventCategories || []);
      this.kulturdatenService.searchAttractionByCategory(attractionTags).subscribe(response => {
        const attractionIds = response.data.attractions.map((attraction: any) => attraction.identifier);
         
        this.kulturdatenService.searchEventsbyFilters([], [], this.eventCat?.costs || false, locationIds, attractionIds).subscribe(events => {
          this.events = events.data.events;  
          this.isLoading = false;
        });          
      });
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }
  
  formatTime(time: string): string {
    return time.substr(0, 5) || '';
  }

  async showAttractionDetails(attractionId: any, locationId: any, eventStartDate: any, eventEndDate: any, eventStartTime: any, eventEndTime: any, eventIsFreeOfCharge: any) {
    this.kulturdatenService.getAttractionById(attractionId).subscribe(response => {

      let attraction = response.data.attraction;

      this.kulturdatenService.getLocationById(locationId).subscribe(async response => {
        const modal = await this.modalCtrl.create({
          component: EventDetailComponent,
          cssClass: 'event-details-modal',
          componentProps: {
            attraction: attraction,
            location: response.data.location,
            event: {
              startDate: eventStartDate,
              endDate: eventEndDate,
              startTime: eventStartTime,
              endTime: eventEndTime,
              isAccessibleForFree: eventIsFreeOfCharge
            }
          }
        });
        await modal.present();
        modal.onDidDismiss().then();
      }, error => {
        console.error('Ein Fehler ist aufgetreten:', error);
      });
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }
  
  private persolanizeEventCat() {
    const userTypeCookie = this.cookieService.get('userType');
    if (userTypeCookie) {
      const preferences = JSON.parse(userTypeCookie);
      this.eventCat = preferences;
      // check if the user has selected any preferences
      if (this.eventCat && (this.eventCat.accessibilityPreferences || this.eventCat.eventCategories || this.eventCat.costs || this.eventCat.boroughPreferences)) {
        this.isPersonalized = true;
      }
      console.log(this.eventCat);
    } else {
      console.log('userType cookie is not set');
    }
  }
  
  private async showQuestionnaireIfNeeded() {
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

  onSearchStart(data: any): void {
    if (data === '') {
      this.events = null;
      this.page = 0;
      this.loadEvents();
      return;
    }
    this.page = 1;
    this.searchAttractionsbyTerm(data);
  }

  private searchAttractionsbyTerm(term: any): void {
    this.isLoading = true;
    this.kulturdatenService.searchAttractions(term).subscribe(response => {
      this.attractions = response;
      this.idsToFilter = this.attractions?.data.attractions.map((attraction: any) => attraction.identifier);
      this.loadEventsAfterSearchTerm();
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

  private loadEventsAfterSearchTerm(): void {
    this.kulturdatenService.getEventsByAttractionIds(this.idsToFilter, 0).subscribe(response => {
      this.events = response.data.events;
      this.isLoading = false;
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

}