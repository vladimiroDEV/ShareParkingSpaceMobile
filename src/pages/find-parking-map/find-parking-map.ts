import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import {
  Marker,
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
 } from '@ionic-native/google-maps';
import { User } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { Coordinates, ParkingInfoVM, UserAuto } from '../../models/UserProfile';
import { HubConnection } from '@aspnet/signalr-client';

@IonicPage()
@Component({
  selector: 'page-find-parking-map',
  templateUrl: 'find-parking-map.html',
})
export class FindParkingMapPage {

  map: GoogleMap;
  markers:Marker[] = [];
  markersOptions: {}[];
  currentLat: number;
  currentLong:number;
   mapOptions: GoogleMapOptions = {
    camera: {
      target: {
        lat: this.currentLat,
        lng: this.currentLong
      },
      zoom: 18,
      tilt: 30
    }
  };
  
  private locality:string;
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
    this.getCoordinates();
  
                    
  }
  loadMap(coordinates:Coordinates[], currentLat:number, currentLong:number) {  

      this.mapOptions.camera.target.lng = currentLong;
      this.mapOptions.camera.target.lat = currentLat;
      console.log("Load Map Options");

      console.log(this.mapOptions)
      this.map = this.googleMaps.create('map_canvas', this.mapOptions);
  
      // Wait the MAP_READY before using any methods.
      this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
           coordinates.forEach(coord=>{
             //aggiunge i marker

             console.log(coord);
           this.fillMarker(coord);  
               
           })
        }); 
   
      }

      getCoordinates(){     
        this.geolocation.getCurrentPosition().then((resp) => {
          this.currentLat = resp.coords.latitude;
          this.currentLong =resp.coords.longitude; 
          console.log("current position");
          console.log(resp)
          this.nativeGeocoder.reverseGeocode(this.currentLat, this.currentLong)
              .then((result: NativeGeocoderReverseResult) => {
                console.log("native geocoder");
                console.log(result)
                this.locality = result[0].locality;
                 this._userServ.GetParkingSpaces(this.locality)
                 .subscribe((res:Coordinates[])=>{
                   console.log("Parking Spaces")
                  console.log(res)
                  this.loadMap(res, resp.coords.latitude,resp.coords.longitude);
                  this.subscribeHubMaps();
    
                 },
                (err) =>  this.showError(err))
              })
              .catch((error: any) => this.showError(error));
         }).catch((error) => {
           console.log('Error getting location', error);
         });
      }

       fillMarker(coord: Coordinates) {
        
      //  this.markers.push();
        this.map.addMarker({
          //title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: +coord.lat,
            lng: +coord.long,
          }
        }
 
      
      ).then(marker => {
          marker.on(GoogleMapsEvent.MARKER_CLICK)
            .subscribe(() => {
              this.alertShowParkingInfo(coord.id);
            });
        });
        
       }
      subscribeHubMaps() {
        let connection = new HubConnection('https://sahreparkingspaceapi.azurewebsites.net/ManageParkingHub');
     
        connection.start()
                  .then(() => {   
                       connection.invoke("JoinGroup", this.locality);
                       
                      });
        console.log("test Location  " +this.locality )  ;

        connection.on('send', (data) => { 
                        console.log(data);
                        this.map.clear().then(()=>{              
                            data.forEach(coord=>{
                              console.log(coord);
                            //this.fillMarker(coord); 
                            this.map.addMarker({
                              //title: 'Ionic',
                              icon: 'blue',
                              animation: 'DROP',
                              position: {
                                lat: +coord.Lat,
                                lng: +coord.Long,
                              }
                            }).then(marker => {
                              marker.on(GoogleMapsEvent.MARKER_CLICK)
                                .subscribe(() => {
                                  this.alertShowParkingInfo(coord.id);
                                });
                            });;
                                
                            });
                        }).catch((clearMapError)=>
                        
                        console.log(clearMapError))
                       });

      }


      showError(err:string) {
        let toast = this.toastCtrl.create({
          message: err, //this.genericErrorString,
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
         let Indirizzo = result[0].thoroughfare + ' ' + result[0].subThoroughfare;
         console.log(res);
       
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
      }).catch((error: any) => this.showError(error));
       },
    (err)=>this.showError(err));

        
    }

  

    

}
