import { Component, OnInit } from '@angular/core';
import { KulturdatenService } from '../services/kulturdaten.service';
import { InfiniteScrollCustomEvent, IonMenu, MenuController, ModalController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FilterMenuComponent } from '../components/filter-menu/filter-menu.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss'],
})
export class EventListPage implements OnInit {
  eventPage = 0;
  events: any;
  isFilteredFlag = false;
  idsToFilter: string[] = [];
  allEventsListed = false;
  numberOfEvents = 0;
  attractions: any;
  searchTerm = '';
  constructor(private menu: MenuController, private kulturdatenService: KulturdatenService, private datePipe: DatePipe, private modalControlle: ModalController) { 
  }

  filters = {
    dates: [] as string[],
    times: [] as string[],
    categories: [] as string[],
    accessibilities: [] as string[],
    boroughs: [] as string[],
    isFreeOfChargeSelected: false,
    selectedLocation: null,
    selectedRadius: 0,
  };
  selectedCategoryNames: string[] = [];
  selectedAccessibilityNames: string[] = [];

  async openFilterMenuModal() {
    const modal = await this.modalControlle.create({
      component: FilterMenuComponent,
      cssClass: 'filter-menu-modal',
      componentProps: {
        filters: this.filters
      }
    });
    await modal.present();
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        this.filters.dates = dataReturned.data.selectedDates;
        this.filters.times = dataReturned.data.selectedTimes;
        this.filters.categories = dataReturned.data.selectedCategories;
        this.filters.accessibilities = dataReturned.data.selectedAccessibilities;
        this.filters.boroughs = dataReturned.data.selectedBoroughs;
        this.filters.isFreeOfChargeSelected = dataReturned.data.isFreeOfChargeSelected;
        this.filters.selectedLocation = dataReturned.data.selectedLocation;
        this.filters.selectedRadius = dataReturned.data.selectedRadius;

        this.selectedCategoryNames = [];
        this.filters.categories.forEach((category: any) => {
          this.selectedCategoryNames.push(category.name);
        });

        this.selectedAccessibilityNames = [];
        this.filters.accessibilities.forEach((accessibility: any) => {
          this.selectedAccessibilityNames.push(accessibility.name);
        });

        this.searchEventsbyFilters();
      }
    });
  }

  removeBorough(district: any): void {
    this.filters.boroughs = this.filters.boroughs.filter((d: any) => {
      return d !== district;
    });
    this.searchEventsbyFilters();
  }
  
  removeTime(time: any): void {
    this.filters.times = this.filters.times.filter((t: any) => {
      return t !== time;
    });
    this.searchEventsbyFilters();
  }

  removeCategory(category: any): void {
    this.filters.categories = this.filters.categories.filter((c: any) => {
      return c.name !== category;
    });
    this.selectedCategoryNames = this.selectedCategoryNames.filter((name: string) => name !== category);
    this.searchEventsbyFilters();
  }

  removeDate(): void {
    this.filters.dates = [];
    this.searchEventsbyFilters();
  }

  removeAccessibility(): void {
    this.filters.accessibilities = [];
    this.selectedAccessibilityNames = [];
    this.searchEventsbyFilters();
  }

  removeFreeOfCharge(): void {
    this.filters.isFreeOfChargeSelected = false;
    this.searchEventsbyFilters();
  }

  private loadEvents(): void {
    this.isFilteredFlag = false;
    this.idsToFilter = [];
    const page = this.eventPage + 1;
    this.kulturdatenService.getEventsByPage(page).subscribe(response => {
      if (this.events && this.events.events) {
        this.events.events = [...this.events.events, ...response.data.events];
      } else {
        this.events = response.data;
      }
      this.eventPage = page;
      if(response.data.totalCount / 30 < this.eventPage) {
        this.allEventsListed = true;
        console.log('All events listed');
      }
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

  ngOnInit() {
    this.eventPage = 0;
    this.loadEvents();
  }
  
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    if(this.allEventsListed) {
      return;
    }
    if(this.isFilteredFlag) {
      return;
    } else {
      this.loadEvents();
    }
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  searchAttractionsbyFilters(): void {
    this.kulturdatenService.searchAttractionsByFilters(this.filters).subscribe(response => {
      this.events = response;
      this.idsToFilter = this.extractAttractionIds();
      this.loadFilteredEvents();
    }
    , error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

  searchEventsbyFilters(): void {
    const locationIds: string[] = [];
    const accessibilityIds = this.filters.accessibilities.map((accessibility: any) => accessibility.id);
    this.kulturdatenService.searchLocationsByBoroughAndTag(this.filters.boroughs, accessibilityIds).subscribe(response => {
      locationIds.push(...response.data.locations.map((location: any) => location.identifier));
  
      const timeFilters: string[] = [];
      this.filters.times.length > 0 ? this.filters.times.forEach((time: any) => {
        if (time == 'Morgens') {
          timeFilters.push('04:00 - 12:00');
        } else if (time == 'Tagsüber') {
          timeFilters.push('12:00 - 18:00');
        } else if (time == 'Abends') {
          timeFilters.push('18:00 - 24:00');
        }
      } ) : [];

      const attractionIds: string[] = [];
      const attractionTags = this.filters.categories.map((category: any) => category.id);
      console.log(attractionTags);
      this.kulturdatenService.searchAttractionByCategory(attractionTags).subscribe(response => {
        console.log(response.data.attractions);
        attractionIds.push(...response.data.attractions.map((attraction: any) => attraction.identifier));

        this.kulturdatenService.searchEventsbyFilters(this.filters.dates, timeFilters, this.filters.isFreeOfChargeSelected, locationIds, attractionIds).subscribe(response => {
          this.events = response;
          this.events = response.data;
          this.isFilteredFlag = true;      
        });
      });
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

  showAttractionDetails(attractionId: any, locationId: any): void {
    console.log(attractionId);
    console.log(locationId);
  }

  searchAttractionsbyTerm(term: any): void {
    this.kulturdatenService.searchAttractions(term).subscribe(response => {
      this.attractions = response;
      this.idsToFilter = this.extractAttractionIds();
      this.loadFilteredEvents();
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

  onSearchStart(data: any): void {
    if (data === '') {
      this.events = null;
      this.eventPage = 0;
      this.allEventsListed = false;
      this.isFilteredFlag = false;
      this.loadEvents();
      return;
    }
    this.allEventsListed = false;
    this.eventPage = 1;
    this.searchTerm = data;
    this.searchAttractionsbyTerm(data);
  }

  extractAttractionIds(): string[] {
    return this.attractions?.data.attractions.map((attraction: any) => attraction.identifier);
  }

  loadFilteredEvents(): void {
    this.kulturdatenService.getEventsByAttractionIds(this.idsToFilter, this.eventPage).subscribe(response => {
      this.events = response.data;
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
