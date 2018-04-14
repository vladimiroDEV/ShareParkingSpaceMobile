import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ToastController, AlertController, Alert } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import {
  Marker,
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
 } from '@ionic-native/google-maps';
import { User, Api } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { Coordinates, ParkingInfoVM, UserAuto } from '../../models/UserProfile';
import { HubConnection } from '@aspnet/signalr-client';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

@IonicPage()
@Component({
  selector: 'page-find-parking-map',
  templateUrl: 'find-parking-map.html',
})
export class FindParkingMapPage {

  map: GoogleMap;
  marketInfoAlert: Alert;
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
      private launchNavigator: LaunchNavigator,
      public loadingCtrl: LoadingController,
      private alertCtrl: AlertController,
      public toastCtrl: ToastController,
      public translateService: TranslateService,
      private nativeGeocoder: NativeGeocoder,
      private geolocation: Geolocation,
      private _api: Api,
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
           this._loading.dismiss(); 
        }); 
   
      }

      getCoordinates(){   
        this._loading = this.loadingCtrl.create({
          content: ''
        });
        this._loading.present();
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
        let connection = new HubConnection(this._api.urlParkingHub);
     
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

        toast.present();
      }

    alertShowParkingInfo(idParking:number) {
      this._userServ.GetParkingSpace(idParking)
      .subscribe((res:ParkingInfoVM)=>
       {
        this.nativeGeocoder.reverseGeocode(res.lat,res.lon)
        .then((result: NativeGeocoderReverseResult)=>{
         let username = res.username;
         let _auto:UserAuto = res.userAuto;
         let Indirizzo = result[0].thoroughfare + ' ' + result[0].subThoroughfare;
         console.log(res);
       
        let content:string ="<p>UserName: " +username+ "</p>"+
        "<p><b>Marca:</b> "+_auto.carBrend+"</p>"+
        "<p><b>Targa: </b>"+ _auto.numberPlate +"</p>"+
        "<p><b>Modello: </b> " +_auto.carModel+ "</p>"+
        "<p><b>Colore: </b>"+ _auto.carColor+"</p>" + 
        "<p><b>Indirizzo: </b> "+Indirizzo +"</p>";
       
        this.marketInfoAlert = this.alertCtrl.create({
          title: '',
          message:  content,
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
              text: 'Prenota',
              handler: () => {
                this.reserveParking(res.parkingID, res.userAuto.autoID,res.lat,res.lon);
              }
            }
          ]
        });
        console.log(alert)
        this.marketInfoAlert.present();
      }).catch((error: any) => this.showError(error));
       },
    (err)=>this.showError(err));

        
    }

    reserveParking(parkingID:number, autoID:number, lat:number, lon:number) {
           this._userServ.ReserveParkingSpace(parkingID, autoID)
           .subscribe((res)=> 
            {
              console.log(res);
              this.marketInfoAlert.dismiss();
              this.launchNavigator.navigate([lat,lon])
                  .then(
                    success => {
                      console.log('Launched navigator');
                      this._userServ.PaidForParkingSpace(parkingID)
                      .subscribe(res=> {
                        console.log("Il pagamento è andato a buon fine");
                      },
                    (err)=> {
                      console.log("s è verificat un errore durante il pagamento")
                    })
                    },
                    error => console.log('Error launching navigator', error)
                  );
              
                  
              
            },
          (err)=> 
          { console.log(err);
            this.marketInfoAlert.dismiss();
          })
    }

  

    

}
