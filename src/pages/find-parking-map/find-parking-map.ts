import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
 } from '@ionic-native/google-maps';
import { User } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { Coordinates } from '../../models/UserProfile';

/**
 * Generated class for the FindParkingMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-find-parking-map',
  templateUrl: 'find-parking-map.html',
})
export class FindParkingMapPage {

  map: GoogleMap;
  private genericErrorString: string;
  private _loading :Loading;
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      private _userServ: User,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public translateService: TranslateService,
      private nativeGeocoder: NativeGeocoder,
      private geolocation: Geolocation,
      private googleMaps: GoogleMaps) {
        this.translateService.get('ERROR_GENERIC').subscribe((value) => {
          this.genericErrorString = value;
        })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindParkingMapPage');
    //this.loadMap();
    this.getCoordinates()
  }
  loadMap(coordinates:Coordinates[], currentLat:number, currentLong:number) {
    
        let mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: currentLat,
              lng: currentLong
            },
            zoom: 18,
            tilt: 30
          }
        };
    
        this.map = this.googleMaps.create('map_canvas', mapOptions);
    
        // Wait the MAP_READY before using any methods.
        this.map.one(GoogleMapsEvent.MAP_READY)
          .then(() => {
            console.log('Map is ready!');
            

             coordinates.forEach(coord=>{
              this.map.addMarker({
                title: 'Ionic',
                icon: 'blue',
                animation: 'DROP',
                position: {
                  lat: +coord.lat,
                  lng: +coord.long,
                }
              })
              .then(marker => {
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                  .subscribe(() => {
                    alert('clicked');
                  });
              });
         
             })
            // Now you can use all methods safely.
         
    
          });
      }

      getCoordinates(){
        this.geolocation.getCurrentPosition().then((resp) => {
          this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
              .then((result: NativeGeocoderReverseResult) => {
                 this._userServ.GetParkingSpaces(result[0].locality)
                 .subscribe((res:Coordinates[])=>{
                  console.log(res)
                  this.loadMap(res, resp.coords.latitude,resp.coords.longitude);
    
                 },
                (err) =>  this.showError())
              })
              .catch((error: any) => this.showError());
         }).catch((error) => {
           console.log('Error getting location', error);
         });
      }


      showError() {
        let toast = this.toastCtrl.create({
          message: this.genericErrorString,
          duration: 10000,
          position: 'middle'
        });
      }

}
