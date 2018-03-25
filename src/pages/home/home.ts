import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { FindParkingMapPage } from '../find-parking-map/find-parking-map';
import { Geolocation } from '@ionic-native/geolocation';
import { User } from '../../providers/providers';
import { UserProfile } from '../../models/UserProfile';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { TestPage } from '../test/test';
import { HubConnection } from '@aspnet/signalr-client';

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
  private genericErrorString: string;
  private shareSuccess: string;
  private _loading :Loading;

  public  _data:string = "";

  constructor(
      public navCtrl: NavController, 
      public _menuCtrl: MenuController,
      public _user:User,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public navParams: NavParams,
      private nativeGeocoder: NativeGeocoder,
      public translateService: TranslateService,
      private geolocation: Geolocation) {
        this.translateService.get('SHARE_PARKING_SUCCESS').subscribe((value) => {
          this.shareSuccess = value;
        })
        this.translateService.get('ERROR_GENERIC').subscribe((value) => {
          this.genericErrorString = value;
        })
  }

  ionViewDidLoad() {
    this._user.getUserInfo().subscribe((res:UserProfile)=>
    {
      console.log(res);

      this._user.setUserProfiile(res);
      this.getUserPosition();
      this.getMysharedParking();
 
    },
    (err)=>{
      console.log(err)
    });
    console.log(this._user._userPosition);

    
  }
  shareParking() {
    var loading = this.loadingCtrl.create({
      content:''
    });

    loading.present();


    this.geolocation.getCurrentPosition().then((resp) => {
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
           .then((result: NativeGeocoderReverseResult) => { 
                 this._user.addParkingSpace(resp.coords.latitude,resp.coords.longitude, result[0].locality)
                 .subscribe((res)=>{
                   loading.dismiss();
                       let toast = this.toastCtrl.create({
                        message: this.shareSuccess,
                        duration: 3000,
                    position: 'middle'
                    });
                   toast.present();
                   },
                   (shareErr) =>  {
                    loading.dismiss();
                    console.log(shareErr)
                   });

           },
          (geocoderError) => {
             console.log(geocoderError)
             loading.dismiss()})
        
        .catch((error: any) => {
          console.log(error)
          loading.dismiss()});
   }).catch((error) => {
    loading.dismiss();
     console.log('Error getting location', error);
   });
  }

  goFindParkingPage() {
    this.navCtrl.push(FindParkingMapPage);
  }

  goTestPage() {
    this.navCtrl.push(TestPage);
  }


  onOpenMenu() {
    this._menuCtrl.open();
  }

  showError() {
    let toast = this.toastCtrl.create({
      message: this.genericErrorString,
      duration: 10000,
      position: 'middle'
    });
  }

  getUserPosition()  {
    console.log("get current position");
    this.geolocation.getCurrentPosition().then((resp) => {
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
          .then((result: NativeGeocoderReverseResult) => {
            this._user._userPosition.lat= resp.coords.latitude;
            this._user._userPosition.long= resp.coords.longitude;
            this._user._userPosition.location= result[0].locality;
             console.log("locality");
            console.log(result[0].locality);
          })
          .catch((error: any) => this.showError());
     }).catch((error) => {
       console.log('Error getting location', error);
     });



  }

  getMysharedParking() {
      let connection = new HubConnection('https://sahreparkingspaceapi.azurewebsites.net/ManageParkingHub');
   
      connection.start()
                .then(() => {   
                     connection.invoke("JoinGroup",  this._user._userProfile.userId);
                     
                    });
      console.log("test jpin username   " + this._user._userProfile.userId )  ;

      connection.on('send', (data) => { 
                      console.log(data);
                      this._data = JSON.stringify(data);
      }
      );
                  

    }

}
