import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, Loading } from 'ionic-angular';

import { User } from '../../providers/providers';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { confirmPassword: string, email: string, password: string } = {
    confirmPassword: '',
    email: '',
    password: ''
  };
  private _loading :Loading;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    private _storage:Storage,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
   this._loading= this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,

    });
    this._loading.present();
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {
      this.user.setToken(resp)
      this._storage.ready().then(() => {
         this._storage.set('token', resp);
         this._loading.dismiss()
         this.navCtrl.push(HomePage);
         //this.navCtrl.push(MainPage);
      });
      
        console.log("Register  ok");

 
      
     
    }, (err) => {
      this._loading.dismiss()

     // this.navCtrl.push(MainPage);

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }



}
