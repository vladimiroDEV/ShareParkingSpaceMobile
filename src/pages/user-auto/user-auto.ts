import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Loading } from 'ionic-angular';
import { User } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { UserAuto } from '../../models/UserProfile';
import { NgForm } from '@angular/forms';

/**
 * Generated class for the UserAutoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-auto',
  templateUrl: 'user-auto.html',
})
export class UserAutoPage {
  private signupErrorString: string;
  private updateSuccesse: string;
  private _loading :Loading;
  auto = new UserAuto();
  @ViewChild('form') public autoForm: NgForm;
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
      this.translateService.get('UPDATE_SECCESS').subscribe((value) => {
        this.updateSuccesse = value;
      })
  }
  ionViewCanLeave(): boolean{
    // here we can either return true or false
    // depending on if we want to leave this view
    // if(true){
    //    return true;
    //  } else {
    //    return false;
    //  }
    if(this.autoForm.form.valid){
      return true;
    }else {
      return false;
    }
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserAutoPage');
    console.log(this._userserv._userProfile);
    if(this._userserv._userProfile.auto){
      this.auto = this._userserv._userProfile.auto;
    }else{
         this.auto = new UserAuto();
    }
    
  }

  doUpdateUserAuto() {
    this._loading= this.loadingCtrl.create({
      content: '',
    });
    this._loading.present();
    this._userserv.updateUserAuto( this.auto).subscribe((res)=>{
     this._loading.dismiss();
     //this.navCtrl.setRoot(HomePage);
     let toast = this.toastCtrl.create({
      message: this.updateSuccesse,
      duration: 3000,
      position: 'middle'
    });
    toast.present();

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
