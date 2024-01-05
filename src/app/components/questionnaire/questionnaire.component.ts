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

  constructor(
    private modalCtrl: ModalController,
    private cookieService: CookieService,
    private fb: FormBuilder
    ) {
      this.questionForm = this.fb.group({
        eventTopics: this.fb.array([]),
        eventTypes: this.fb.array([]),
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
