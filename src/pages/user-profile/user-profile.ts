import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, NavParams, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers/providers';
import { UserProfile } from '../../models/UserProfile';


/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  private signupErrorString: string;
  private updateSuccesse: string;

  user:{displayName:string,name:string, surname:string} = {
    displayName:'',
    name:'',
    surname:''
  };
  private _loading :Loading;
  constructor(
    public navCtrl: NavController, 
    public navParam: NavParams,
    public _userserv: User,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

      this.translateService.get('ERROR_GENERIC').subscribe((value) => {
        this.signupErrorString = value;
      })
      this.translateService.get('UPDATE_SECCESS').subscribe((value) => {
        this.updateSuccesse = value;
      })
  }

  ionViewDidLoad() {

    console.log(this._userserv._userProfile);

   this.user.displayName =this._userserv._userProfile.displayName;
   this.user.name = this._userserv._userProfile.name;
   this.user.surname  =this._userserv._userProfile.surname;
   
  }

  doUpdateUserProfile(){
    this._loading= this.loadingCtrl.create({
      content: '',
    });
    this._loading.present();

    let userInfo = new UserProfile;
    userInfo.displayName = this.user.displayName;
    userInfo.name = this.user.name;
    userInfo.surname =  this.user.surname;
    this._userserv.updateUserInfo( userInfo).subscribe((res)=>{
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
