import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent  implements OnInit {

  constructor(private modalCtrl: ModalController, private datePipe: DatePipe) { }

  @Input() attraction: any;
  @Input() location: any;
  @Input() event: any;

  ngOnInit() {
  }

  
  closeModal(): void {
    this.modalCtrl.dismiss();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }

  formatTime(time: string): string {
    return time.substr(0, 5) || '';
  }

}
