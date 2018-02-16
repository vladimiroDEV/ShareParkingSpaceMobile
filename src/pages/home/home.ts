import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FindParkingMapPage } from '../find-parking-map/find-parking-map';
import { Geolocation } from '@ionic-native/geolocation';
import { User } from '../../providers/providers';
import { UserProfile } from '../../models/UserProfile';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
      public navCtrl: NavController, 
      public _menuCtrl: MenuController,
      public _user:User,
      public navParams: NavParams,
      private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    this._user.getUserInfo().subscribe((res:UserProfile)=>
    {
      console.log(res);
      this._user.setUserProfiile(res);
    },
    (err)=>{
      console.log(err)
    })
    console.log('ionViewDidLoad HomePage');
  }
  shareParking() {
    console.log("shareparking");

    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      console.log("lat " +resp.coords.latitude)
      console.log("long " +resp.coords.longitude)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  goFindParkingPage() {
    this.navCtrl.push(FindParkingMapPage);
  }

  onOpenMenu() {
    this._menuCtrl.open();
  }

}
