import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { User } from '../../providers/user/user';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, private user: User,private loadingCtrl:LoadingController) {
  }

  ionViewDidLoad() {
    let loading =   this.loadingCtrl.create({
      content: ''
    });
    loading.present();
    this.user.logout();
    this.navCtrl.setRoot(WelcomePage);

    loading.dismiss();
    
  }

}
