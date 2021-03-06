import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ToastController,  LoadingController } from 'ionic-angular';
import { FindParkingMapPage } from '../find-parking-map/find-parking-map';
import { Geolocation } from '@ionic-native/geolocation';
import { User, Api } from '../../providers/providers';
import { UserProfile, MyParkingVM, MySharePosition, MyParkingVMHub, UserAuto } from '../../models/UserProfile';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { TranslateService } from '@ngx-translate/core';
import { HubConnection } from '@aspnet/signalr-client';
import { UserAutoPage } from '../user-auto/user-auto';

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
 
  private mySharedPosistion:MySharePosition =  new MySharePosition();



  public  _data:string = "";

  constructor(
      public navCtrl: NavController, 
      public _menuCtrl: MenuController,
      public _user:User,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public navParams: NavParams,
      public _api:Api,
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
      if(res.auto == null) {

        this.navCtrl.push(UserAutoPage);
     
    }
      this._user.setUserProfiile(res);
     
      this.getUserPosition();
      this.getMySharedParking();
 
    },
    (err)=>{
      console.log(err)
    });
    console.log(this._user._userPosition);

    
  }

  getMySharedParking(){

    this._user.getMySharedParking(this._user._userProfile.userId)
    .subscribe((res:MyParkingVM) => {
      
   if(res) {
    this.nativeGeocoder.reverseGeocode(res.lat, res.lng)
    .then((result: NativeGeocoderReverseResult) => { 

      this.mySharedPosistion.Citta = result[0].locality;
      this.mySharedPosistion.Via = result[0].thoroughfare + ' ' +result[0].subThoroughfare;
      this.mySharedPosistion.isShared = true;

      if(res.username != null && res.username != "" ) {
       this.mySharedPosistion.isReserved = true;
       this.mySharedPosistion.auto = res.userAuto;
       this.mySharedPosistion.username = res.username;
      }

      console.log(result[0])
    })
    .catch((error: any) => {
      console.log(error)

      this.mySharedPosistion = new MySharePosition();
      });


      this._data = JSON.stringify(res);
       this.connectParkingHub();
   }
    
    },
  err => {
     this.mySharedPosistion =  new MySharePosition();
  })

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
                   this.getMySharedParking();
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

  deleteMyParking() {
    this._user.deleteMySharedParking()
    .subscribe(res => {
      //console.log(res);
      this.getMySharedParking();

    },
  (err) => {
     console.log(err);
  })
    
  }

  onOpenMenu() {
    this._menuCtrl.open();
  }

  showError() {
   
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

  connectParkingHub() {
      let connection = new HubConnection(this._api.urlParkingHub);
   
      connection.start()
                .then(() => {   
                     connection.invoke("JoinGroup",  this._user._userProfile.userId);
                     
                    });
      console.log("test Join   username   " + this._user._userProfile.userId )  ;
     
      connection.on('send', (data:MyParkingVMHub) => { 
             
        if(this.mySharedPosistion.auto == null) this.mySharedPosistion.auto = new UserAuto();

        if(data.Username != null && data.Username != "") {
          this.mySharedPosistion.username= data.Username;
          this.mySharedPosistion.auto.carBrend = data.UserAuto.CarBrend;
          this.mySharedPosistion.auto.carColor = data.UserAuto.CarColor;
          this.mySharedPosistion.auto.carModel = data.UserAuto.CarModel;
          this.mySharedPosistion.auto.numberPlate = data.UserAuto.NumberPlate;
          this.mySharedPosistion.isReserved = true;
        }
                      console.log(data);
                      this._data = JSON.stringify(data);
      }
      );
                  

    }

   

}
