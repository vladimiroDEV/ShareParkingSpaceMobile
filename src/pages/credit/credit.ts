import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Loading } from 'ionic-angular';
import { User } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { UserProfile } from '../../models/UserProfile';


@IonicPage()
@Component({
  selector: 'page-credit',
  templateUrl: 'credit.html',
})
export class CreditPage {

  refillModel:number = 0;
  _user = new UserProfile();
  private signupErrorString: string;
  private updateSuccesse: string;
  private _loading :Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _userserv: User,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
      this.translateService.get('ERROR_GENERIC').subscribe((value) => {
        this.signupErrorString = value;
      })
      this.translateService.get('REFILL_SECCESS').subscribe((value) => {
        this.updateSuccesse = value;
      })
  }

  ionViewDidLoad() {
    this._user = this._userserv._userProfile;
  }

  doRefillCredit() {
    this._loading= this.loadingCtrl.create({
      content: '',
    });
    this._loading.present();
    this._userserv.refillCredit(this.refillModel).subscribe((res)=>{
     this._loading.dismiss();
     //this.navCtrl.setRoot(HomePage);
     let toast = this.toastCtrl.create({
      message: this.updateSuccesse,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
    let currentCredit = +this._userserv._userProfile.credits;
    this._userserv._userProfile.credits = +currentCredit + (+this.refillModel);

    },(err)=>{
      this._loading.dismiss();
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    })   

  }

}
