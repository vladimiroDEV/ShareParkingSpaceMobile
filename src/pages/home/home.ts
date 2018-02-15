import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { FindParkingMapPage } from '../find-parking-map/find-parking-map';
import { Geolocation } from '@ionic-native/geolocation';

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
      public navParams: NavParams,
      private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
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
