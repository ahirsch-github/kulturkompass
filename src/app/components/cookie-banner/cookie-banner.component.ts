import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss'],
})
export class CookieBannerComponent  implements OnInit {

  isCookieAccepted = this.cookieService.check('isCookieAccepted');

  @Input() preferences: any;

  constructor(private cookieService: CookieService, private modalCtrl: ModalController) { }

  ngOnInit() {}

  acceptCookies() {
    this.cookieService.set('isCookieAccepted', 'true', { expires: 365 });
    this.cookieService.set('preferences', this.preferences, { expires: 365 });
    this.isCookieAccepted = true;
    this.modalCtrl.dismiss();
  }

  rejectCookies() {
    this.cookieService.set('isCookieAccepted', 'false', { expires: 365 });
    this.isCookieAccepted = true;
    this.modalCtrl.dismiss();
  }

  onModalClose() {
    this.modalCtrl.dismiss();
  }
}
