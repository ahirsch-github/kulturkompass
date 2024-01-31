import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AttractionTags } from '../../enums/attraction-tags';
import { LocationTags } from '../../enums/location-tags';
import { LocationModalComponent } from '../location-modal/location-modal.component';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent  implements OnInit {
  categories = [
    { id: AttractionTags.Art, name: 'Kunst' },
    { id: AttractionTags.Children, name: 'Kinder' },
    { id: AttractionTags.Christmas, name: 'Weihnachten' },
    { id: AttractionTags.Conferences, name: 'Konferenzen' },
    { id: AttractionTags.Dance, name: 'Tanz' },
    { id: AttractionTags.Education, name: 'Bildung' },
    { id: AttractionTags.Exhibitions, name: 'Ausstellungen' },
    { id: AttractionTags.Festivals, name: 'Festivals' },
    { id: AttractionTags.Health, name: 'Gesundheit' },
    { id: AttractionTags.InformationEvents, name: 'Infoveranstaltungen' },
    { id: AttractionTags.Lectures, name: 'Lesungen' },
    { id: AttractionTags.Music, name: 'Musik' },
    { id: AttractionTags.Police, name: 'Polizei' },
    { id: AttractionTags.Politics, name: 'Politik' },
    { id: AttractionTags.Recreation, name: 'Erholung' },
    { id: AttractionTags.Seniors, name: 'Senioren' },
    { id: AttractionTags.Stages, name: 'Bühnen' },
    { id: AttractionTags.Walks, name: 'Spaziergänge' },
    { id: AttractionTags.WeeklyMarkets, name: 'Wochenmärkte' },
    { id: AttractionTags.Women, name: 'Frauen' },
  ]

  accessibilities = [
    { id: LocationTags.wheelchairAccessible, name: 'Rollstuhlgerecht' },
    { id: LocationTags.disabledParking, name: 'Behindertenparkplatz' },
    { id: LocationTags.elevator, name: 'Aufzug' },
    { id: LocationTags.wcDin18024, name: 'WC nach DIN 18024' },
    { id: LocationTags.radioHearingAid, name: 'Höranlage Radio' },
    { id: LocationTags.inductiveHearingAid, name: 'Höranlage Induktiv' },
    { id: LocationTags.infraredHearingAid, name: 'Höranlage Infrarot' },
    { id: LocationTags.notForWheelchair, name: 'Nicht für RollstuhlfahrerInnen geeignet' },
    { id: LocationTags.wheelchairDifficult, name: 'Für RollstuhlfahrerInnen erschwert zugänglich' },
  ]

  boroughs = [ 
    { name: 'Mitte', },
    { name: 'Friedrichshain-Kreuzberg', },
    { name: 'Pankow', },
    { name: 'Charlottenburg-Wilmersdorf', },
    { name: 'Spandau', },
    { name: 'Steglitz-Zehlendorf', },
    { name: 'Tempelhof-Schöneberg', },
    { name: 'Neukölln', },
    { name: 'Treptow-Köpenick', },
    { name: 'Marzahn-Hellersdorf', },
    { name: 'Lichtenberg', },
    { name: 'Reinickendorf', }
  ];

  times = [
    { name: 'Morgens', },
    { name: 'Tagsüber', },
    { name: 'Abends', },
  ];

  isFreeOfChargeSelected = false;
  selectedAccessibilities: any[] = [];
  selectedCategories: any[] = [];
  selectedBoroughs: any[] = [];
  selectedDates: any[] = [];
  selectedTimes: any[] = [];
  selectedLocation: any;
  selectedRadius: any;

  @Input() filters: any;
  defaultLocation: any = [52.5200, 13.4050];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.selectedAccessibilities = this.filters.accessibilities || [];
    this.selectedCategories = this.filters.categories || [];
    this.selectedBoroughs = this.filters.boroughs || [];
    this.selectedDates = this.filters.dates || [];
    this.selectedTimes = this.filters.times || [];
    this.isFreeOfChargeSelected = this.filters.isFreeOfChargeSelected || false;
  }

  handleAccessibilityChange(event: any) {
    this.selectedAccessibilities = event.detail.value;
  }

  handleCategoryChange(event: any) {
    this.selectedCategories = event.detail.value;
  }

  handleBoroughChange(event: any) {
    this.selectedBoroughs = event.detail.value;
  }

  handlePriceChange(event: any) {
    this.isFreeOfChargeSelected = event.detail.checked;
  }

  handleDateChange( event: any) {
    this.selectedDates = event.detail.value;
  }

  handleTimeChange(event: any) {
    this.selectedTimes = event.detail.value;
  }

  applyFilters() {
    this.modalCtrl.dismiss({
      'selectedDates': this.selectedDates,
      'selectedTimes': this.selectedTimes,
      'selectedCategories': this.selectedCategories,
      'selectedBoroughs': this.selectedBoroughs,
      'selectedAccessibilities': this.selectedAccessibilities,
      'isFreeOfChargeSelected': this.isFreeOfChargeSelected,
      'selectedLocation': this.selectedLocation,
      'selectedRadius': this.selectedRadius,
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  resetFilters() {
    this.selectedAccessibilities = [];
    this.selectedCategories = [];
    this.selectedBoroughs = [];
    this.selectedDates = [];
    this.selectedTimes = [];
    this.isFreeOfChargeSelected = false;
    this.selectedLocation = null;
    this.selectedRadius = null;
  }

  compareWith(o1: any, o2: any) {
    if (!o1 || !o2) {
      return o1 === o2;
    }
    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }
    return o1.id === o2.id;
  }

  compareWithDt(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  compareWithFn(o1: any, o2: any) {
    if (Array.isArray(o2)) {
      return o2.some(o => o.name === o1.name);
    }
    return o1 && o2 ? o1.name === o2.name : o1 === o2;
  }

  async openLocationSelectionModal() {
    const modal = await this.modalCtrl.create({
      component: LocationModalComponent,
      cssClass: 'half-height-modal',
      componentProps: {
        'selectedLocation': this.defaultLocation,
        'selectedRadius': 3,
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.selectedLocation = data.location;
      this.selectedRadius = data.radius;
    }
  }

}
