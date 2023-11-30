import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
        eventType: [''],
        frequency: [''],
        priority: [''],
        mobility: ['']
      });
    }

  ngOnInit() {  
  }

  submitAnswers() {
    console.log('Submitting answers');
    const answers = this.questionForm.value;
    console.log(answers);
    this.cookieService.set('userType', answers.eventType);
    localStorage.setItem('hasVisited', 'true');
    this.modalCtrl.dismiss();
  }

}
