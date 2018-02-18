import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';
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
import { Coordinates, ParkingInfoVM, UserAuto } from '../../models/UserProfile';

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
      private alertCtrl: AlertController,
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
             coordinates.forEach(coord=>{
              this.map.addMarker({
                //title: 'Ionic',
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
                    this.alertShowParkingInfo(coord.id);
                  });
              });
         
             })
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

    alertShowParkingInfo(idParking:number) {
      this._userServ.GetParkingSpace(idParking)
      .subscribe((res:ParkingInfoVM)=>
       {
        this.nativeGeocoder.reverseGeocode(res.lat,res.lon)
        .then((result: NativeGeocoderReverseResult)=>{
         let username = res.username;
         let _auto:UserAuto = res.auto;
         let _username = res.username;
         let Indirizzo = result[0].thoroughfare + ' ' + result[0].subThoroughfare;
       
        let content:string ="";
        let alert = this.alertCtrl.create({
          title: '',
          message:  '<p>UserName: ' +username+ '</p>'+
             '<p>Marca: '+_auto.carBrend+'</p>'+
             '<p>Targa '+ _auto.numberPlate +'</p>'+
             '<p>Modello ' +_auto.carModel+ '</p>'+
             ' <p>Colore '+ _auto.carColor+'</p>' + 
             '<p>Indirizzo '+Indirizzo +'</p>'
          ,
          //message: JSON.stringify(res) + JSON.stringify(result),
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Buy',
              handler: () => {
                console.log('Buy clicked');
              }
            }
          ]
        });
        alert.present();
      }).catch((error: any) => this.showError());
       },
    (err)=>this.showError());

        
    }

  

    

}
