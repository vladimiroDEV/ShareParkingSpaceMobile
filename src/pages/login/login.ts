import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User } from '../../providers/providers';
//import { MainPage } from '../pages';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private _loading :Loading;
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    // email: 'test@mail.it',
    // password: 'password'
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    private _storage:Storage,
    public user: User,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this._loading = this.loadingCtrl.create({
      content: ''
    });
    this._loading.present();

    this.user.login(this.account).subscribe((resp) => {
      this.user.setToken(resp)
      this._storage.ready().then(() => {
         this._storage.set('token', resp);
         this._loading.dismiss();
         this.navCtrl.push(HomePage);
         //this.navCtrl.push(MainPage);
      });
      
        console.log("login ok");

    }, (err) => {
     // this.navCtrl.push(MainPage);
      // Unable to log in
      console.log("Application error : ");
      console.log(err)

      this._loading.dismiss();
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });
  }
}
