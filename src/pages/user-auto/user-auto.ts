import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Loading } from 'ionic-angular';
import { User } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';
import { UserAuto } from '../../models/UserProfile';

/**
 * Generated class for the UserAutoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-auto',
  templateUrl: 'user-auto.html',
})
export class UserAutoPage {
  private signupErrorString: string;
  private updateSuccesse: string;
  private _loading :Loading;

  //  auto:{plate:string, brend:string, model:string,color:string}={
  //    plate:'',
  //    brend:'',
  //    model:'',
  //    color:''
  //  }

  auto = new UserAuto();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _userserv: User,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {
      this.translateService.get('ERROR_GENERIC').subscribe((value) => {
        this.signupErrorString = value;
      })
      this.translateService.get('UPDATE_SECCESSE').subscribe((value) => {
        this.updateSuccesse = value;
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserAutoPage');
    console.log(this._userserv._userProfile);
    this.auto = this._userserv._userProfile.auto;

  //  this.auto.numberPlate =this._userserv._userProfile.auto.numberPlate;
  //  this.auto.carBrend =this._userserv._userProfile.auto.carBrend;
  //  this.auto.carModel =this._userserv._userProfile.auto.carModel;
  //  this.auto.carColor =this._userserv._userProfile.auto.carColor;
  }

  doUpdateUserAuto() {
    this._loading= this.loadingCtrl.create({
      content: '',
    });
    this._loading.present();

    // let userAuto = new UserAuto;
    // userAuto = this.auto
    // userAuto.displayName = this.user.displayName;
    // userInfo.name = this.user.name;
    // userInfo.surname =  this.user.surname;
    this._userserv.updateUserAuto( this.auto).subscribe((res)=>{
     this._loading.dismiss();
     //this.navCtrl.setRoot(HomePage);
     let toast = this.toastCtrl.create({
      message: this.updateSuccesse,
      duration: 3000,
      position: 'middle'
    });
    toast.present();

    },(err)=>{
      this._loading.dismiss();
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    })   

  }

}
