import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QuestionnaireComponent } from '../components/questionnaire/questionnaire.component';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { KulturdatenService } from '../services/kulturdaten.service';
import { DatePipe } from '@angular/common';
import { EventDetailComponent } from '../components/event-detail/event-detail.component';
import { CookieBannerComponent } from '../components/cookie-banner/cookie-banner.component';

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
  isLoading = false;
  idsToFilter: string[] = [];
  isCookieAccepted = this.cookieService.check('isCookieAccepted')

  constructor(
    private modalCtrl: ModalController,
    private cookieService: CookieService,
    private kulturdatenService: KulturdatenService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.showQuestionnaireIfNeeded();
  }

  /**
   * Opens the cookie banner modal.
   * @param preferences - The preferences for the cookie banner.
   * @returns A promise that resolves when the modal is presented.
   */
  async openCookieBanner(preferences: any) {

    // TODO: uncomment if for production, comment for development

    // if (this.cookieService.check('isCookieAccepted') == false || this.cookieService.check('isCookieAccepted') == true) {
      const modal = await this.modalCtrl.create({
        component: CookieBannerComponent,
        cssClass: 'cookie-banner-modal',
        componentProps: {
          preferences: preferences
        }
      });
      modal.onDidDismiss().then((data) => {
        if (this.cookieService.get('isCookieAccepted') == 'true') {
          const preferences = this.cookieService.get('preferences');
        }
      });
      return await modal.present();
    // }
  }
  
  /**
   * Checks if the cookie is accepted and shows the questionnaire if needed.
   * If the cookie 'isCookieAccepted' doesn't exist, a modal with the QuestionnaireComponent is created and displayed.
   * After the modal is dismissed, the preferences are retrieved and used to personalize event categories.
   * The events are then loaded and the cookie banner is opened.
   * If the cookie is already existing, the event categories are personalized and the events are loaded.
   */
  private async showQuestionnaireIfNeeded() {

    // TODO: uncomment if and else for production, comment for development

    // if (this.isCookieAccepted == false) {
      const modal = await this.modalCtrl.create({
        component: QuestionnaireComponent
      });
    
      modal.onDidDismiss().then((data) => {
        const preferences = data.data?.preferences;
        if (preferences == undefined) {
          this.eventCat = {
            accessibilityPreferences: [],
            eventCategories: [],
            costs: false,
            boroughPreferences: []
          }
        } else {
          this.eventCat = JSON.parse(preferences);
        }
        this.persolanizeEventCat()
        this.loadEvents();
        this.openCookieBanner(preferences);
      });
      return await modal.present();
    // } else {
    //   if (this.cookieService.check('preferences')) {
    //     this.persolanizeEventCat();
    //     this.loadEvents();
    //   }
    //   this.loadEvents();
    // }
  }

  /**
   * Loads events based on selected preferences.
   * First, it loads the locations based on the borough and accessibility preferences.
   * Then, it loads the attractions based on the event categories.
   * Finally, it loads the events based on the location- and attraction-ids.
   */
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

  /**
   * Shows the details of an attraction by opening a modal with the EventDetailComponent.
   * 
   * @param attractionId - The ID of the attraction.
   * @param locationId - The ID of the location.
   * @param eventStartDate - The start date of the event.
   * @param eventEndDate - The end date of the event.
   * @param eventStartTime - The start time of the event.
   * @param eventEndTime - The end time of the event.
   * @param eventIsFreeOfCharge - Indicates if the event is free of charge.
   * @returns A promise that resolves when the attraction details are shown.
   */
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
  
  /**
   * Persolanizes the event categories based on the user's preferences stored in the cookie 'preferences'.
   */
  private persolanizeEventCat() {
    const userTypeCookie = this.cookieService.get('preferences');
    if (userTypeCookie) {
      const preferences = JSON.parse(userTypeCookie);
      this.eventCat = preferences;
      this.loadEvents();
    }
  }

  /**
   * Handles the start of a search.
   * If the search term is empty, it resets the events list and loads the initial events.
   * Otherwise, it performs a search for attractions based on the provided search term.
   * @param data - The search term.
   */
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

  /**
   * Searches attractions by the given term.
   * @param term The term to search for attractions.
   */
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

  /**
   * Loads events after searching for a specific term by searching for events based on the attraction ids.
   */
  private loadEventsAfterSearchTerm(): void {
    this.kulturdatenService.getEventsByAttractionIds(this.idsToFilter, 0).subscribe(response => {
      this.events = response.data.events;
      this.isLoading = false;
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }
  
  formatTime(time: string): string {
    return time.substr(0, 5) || '';
  }
}