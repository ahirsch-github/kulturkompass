import { Component, OnInit } from '@angular/core';
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
  constructor(private kulturdatenService: KulturdatenService, private datePipe: DatePipe) { }

  private loadEvents(): void {
    const page = this.eventPage + 1;
    this.kulturdatenService.getEvents(page).subscribe(response => {
      if (this.events && this.events.events) {
        this.events.events = [...this.events.events, ...response.data.events];
      } else {
        this.events = response.data;
      }
      this.eventPage = page;
      console.log(this.events);
    }, error => {
      console.error('Ein Fehler ist aufgetreten:', error);
    });
  }

  ngOnInit() {
    this.loadEvents();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.loadEvents();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }
  
  formatTime(time: string): string {
    return time.substr(0, 5) || '';
  }

}
