import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { AttractionTags } from 'src/app/enums/attraction-tags';
import { LocationTags } from 'src/app/enums/location-tags';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {

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
  ];

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

  filters: any = {
    accessibilityPreferences: false,
    eventCategories: [],
    costs: false,
    boroughPreferences: []
  };


  constructor(private modalCtrl: ModalController, private cookieService: CookieService){}

  ngOnInit() {  
  }

  /**
   * Handles the checkbox change event.
   * @param e - The event object.
   * @param formControlName - The name of the form control.
   */
  onCheckboxChange(e: any, formControlName: string) {
    if(formControlName === 'costs') {
      if(e.detail.value) {
        this.filters[formControlName] = true;
      } else {
        this.filters[formControlName] = false;
      }
    } else if(formControlName === 'eventCategories') {
      this.filters[formControlName] = [];
      for (let i = 0; i < this.categories.length; i++) {
        for (let j = 0; j < e.detail.value.length; j++) {
          e.detail.value[j] = e.detail.value[j].replace(/\s/g, '');
          if (e.detail.value[j] === this.categories[i].name) {
            this.filters[formControlName].push(this.categories[i].name);
          }
        }
      }
    } else if(formControlName === 'boroughPreferences') {
      this.filters[formControlName] = [];
      for (let i = 0; i < this.boroughs.length; i++) {
        for (let j = 0; j < e.detail.value.length; j++) {
          e.detail.value[j] = e.detail.value[j].replace(/\s/g, '');
          if (e.detail.value[j] === this.boroughs[i].name) {
            this.filters[formControlName].push(this.boroughs[i].name);
          }
        }
      }
    } else if(formControlName === 'accessibilityPreferences') {
      if(e.detail.value) {
        this.filters[formControlName] = true;
      } else {
        this.filters[formControlName] = false;
      }
    } else {
      this.filters[formControlName] = e.detail.value;
    }
  }

  compareWith(o1: any, o2: any): boolean {
    o2 = o2.replace(/\s/g, '');
    return o1 === o2;
  }

  /**
   * Close modal and save selection
   */
  submitAnswers() {
    const eventCategoriesWithId = [];

    for (let category of this.categories) {
      console.log(category.name);
      for (let filter of this.filters.eventCategories) {
        console.log(filter);
        if (category.name === filter) {
          eventCategoriesWithId.push(category.id);
        }
      }
    }
    
    this.filters.eventCategories = eventCategoriesWithId;

    const accessibilityPreferencesWithId = [];
    if (this.filters.accessibilityPreferences) {
      accessibilityPreferencesWithId.push(LocationTags.wheelchairAccessible);
    }
    this.filters.accessibilityPreferences = accessibilityPreferencesWithId;

    const stringifiedAnswers = JSON.stringify(this.filters);
    this.cookieService.set('userType', stringifiedAnswers);
    localStorage.setItem('hasVisited', 'true');
    this.modalCtrl.dismiss();
  }

  /**
   * Close modal without saving the selection
   */
  closeModal() {
    this.modalCtrl.dismiss();
  }

}
