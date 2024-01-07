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
    dates: [],
    times: [],
    categories: [],
    accessibilities: [],
    districts: [{}],
    isFreeOfChargeSelected: false
  };
  selectedDistrictNames: string[] = [];
  selectedCategoryNames: string[] = [];
  selectedAccessibilityNames: string[] = [];
  selectedTimeNames: string[] = [];

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
        this.filters.districts = dataReturned.data.selectedDistricts;
        this.filters.isFreeOfChargeSelected = dataReturned.data.isFreeOfChargeSelected;

        this.selectedDistrictNames = [];
        this.filters.districts.forEach((district: any) => {
          if(district.name) this.selectedDistrictNames.push(district.name);
        });

        this.selectedCategoryNames = [];
        this.filters.categories.forEach((category: any) => {
          this.selectedCategoryNames.push(category.name);
        });

        this.selectedAccessibilityNames = [];
        this.filters.accessibilities.forEach((accessibility: any) => {
          this.selectedAccessibilityNames.push(accessibility.name);
        });

        this.selectedTimeNames = [];
        this.filters.times.forEach((time: any) => {
          this.selectedTimeNames.push(time.name);
        });
      }
    });
  }

  removeDistrict(district: any): void {
    this.filters.districts = this.filters.districts.filter((d: any) => {
      console.log(d.name);
      console.log(district);
      return d.name !== district;
    });
    this.selectedDistrictNames = this.selectedDistrictNames.filter((name: string) => name !== district);
    console.log(this.selectedDistrictNames.length);
    console.log(this.selectedCategoryNames);
    console.log(this.filters.districts);
  }
  
  removeTime(time: any): void {
    this.filters.times = this.filters.times.filter((t: any) => {
      return t.name !== time;
    });
    this.selectedTimeNames = this.selectedTimeNames.filter((name: string) => name !== time);
  }

  removeCategory(category: any): void {
    this.filters.categories = this.filters.categories.filter((c: any) => {
      return c.name !== category;
    });
    this.selectedCategoryNames = this.selectedCategoryNames.filter((name: string) => name !== category);
  }

  removeDate(): void {
      this.filters.dates = [];
  }

  removeAccessibility(): void {
      this.filters.accessibilities = [];
      this.selectedAccessibilityNames = [];
  }

  removeFreeOfCharge(): void {
    this.filters.isFreeOfChargeSelected = false;
  }

  private loadEvents(): void {
    this.isFilteredFlag = false;
    this.idsToFilter = [];
    const page = this.eventPage + 1;
    this.kulturdatenService.getEvents(page).subscribe(response => {
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
      this.searchAttractionsbyTerm(this.searchTerm);
    }
    this.loadEvents();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
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
      this.isFilteredFlag = true;
      if(response.data.totalCount / 30 <= this.eventPage) {
        this.allEventsListed = true;
        console.log('All events listed');
      }
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
