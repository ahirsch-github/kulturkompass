import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AttractionTags } from '../../enums/attraction-tags';
import { LocationTags } from '../../enums/location-tags';

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

  districts = [ 
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
  selectedDistricts: any[] = [];
  selectedDates: any[] = [];
  selectedTimes: any[] = [];

  @Input() filters: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.selectedAccessibilities = this.filters.accessibilities || [];
    this.selectedCategories = this.filters.categories || [];
    this.selectedDistricts = this.filters.districts || [];
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

  handleDistrictChange(event: any) {
    this.selectedDistricts = event.detail.value;
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
      'selectedDistricts': this.selectedDistricts,
      'selectedAccessibilities': this.selectedAccessibilities,
      'isFreeOfChargeSelected': this.isFreeOfChargeSelected
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
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

}
