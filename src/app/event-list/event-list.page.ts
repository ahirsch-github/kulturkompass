import { Component, Input, OnInit, Output } from '@angular/core';
import { KulturdatenService } from '../services/kulturdaten.service';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { DatePipe } from '@angular/common';

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
  constructor(private kulturdatenService: KulturdatenService, private datePipe: DatePipe) { }

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
      this.loadFilteredEvents();
    } else {
      this.loadEvents();
    }
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
      if (this.eventPage === 1) {
        this.events = response.data;
      } else {
        this.events.events = [...this.events.events, ...response.data.events];
      }
      this.isFilteredFlag = true;
      if(Math.ceil(response.data.totalCount / 30) == this.eventPage) {
        this.allEventsListed = true;
        console.log('All events listed');
      }
      this.eventPage++;
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
