import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {
  questionForm: FormGroup;
  categories = [
    { "identifier": "attraction.category.Walks", "title": "Spaziergänge, Ausflüge" },
    { "identifier": "attraction.category.Dance", "title": "Tanz, Theater" },
    { "identifier": "attraction.category.Lectures", "title": "Lesungen, Vorträge" },
    { "identifier": "attraction.category.Politics", "title": "Politik, Bürgerservice" },
    { "identifier": "attraction.category.Festivals", "title": "Feste, Events" },
    { "identifier": "attraction.category.Seniors", "title": "Senioren" },
    { "identifier": "attraction.category.WeeklyMarkets", "title": "Wochen- und Flohmärkte" },
    { "identifier": "attraction.category.Music", "title": "Musik, Konzerte" },
    { "identifier": "attraction.category.Exhibitions", "title": "Ausstellungen" },
    { "identifier": "attraction.category.Conferences", "title": "Konferenzen, Messen" },
    { "identifier": "attraction.category.Women", "title": "Frauen" },
    { "identifier": "attraction.category.Art", "title": "Kunst, Kultur" },
    { "identifier": "attraction.category.Stages", "title": "Bühnen, Filme" },
    { "identifier": "attraction.category.Education", "title": "Bildung, Schule" },
    { "identifier": "attraction.category.Police", "title": "Polizei" },
    { "identifier": "attraction.category.Children", "title": "Kinder, Jugendliche" },
    { "identifier": "attraction.category.Health", "title": "Gesundheit, Umwelt" },
    { "identifier": "attraction.category.Recreation", "title": "Freizeit, Sport" },
    { "identifier": "attraction.category.InformationEvents", "title": "Infoveranstaltungen" },
    { "identifier": "attraction.category.ChristmasTime", "title": "Weihnachtszeit, Jahreswechsel" }
  ];


  constructor(
    private modalCtrl: ModalController,
    private cookieService: CookieService,
    private fb: FormBuilder
    ) {
      this.questionForm = this.fb.group({
        accessibilityPreferences: this.fb.array([]),
        eventCategories: this.fb.array([]),
        costs: this.fb.array([]),
        districts: this.fb.array([])
      });
    }

  ngOnInit() {  
  }

  onCheckboxChange(e: any, formControlName: string) {
    const checkArray: FormArray = this.questionForm.get(formControlName) as FormArray;
  
    if (e.detail.checked) {
      checkArray.push(new FormControl(e.detail.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: AbstractControl) => {
        if (item.value == e.detail.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  submitAnswers() {
    console.log('Submitting answers');
    const answers = this.questionForm.value;
    const stringifiedAnswers = JSON.stringify(answers);
    console.log(stringifiedAnswers);
    this.cookieService.set('userType', stringifiedAnswers);
    localStorage.setItem('hasVisited', 'true');
    this.modalCtrl.dismiss();
  }

}
