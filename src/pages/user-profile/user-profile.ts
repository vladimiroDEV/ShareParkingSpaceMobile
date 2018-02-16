import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController, NavParams, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../providers/providers';
import { UserProfile } from '../../models/UserProfile';
import { HomePage } from '../home/home';


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

      this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
        this.signupErrorString = value;
      })
  }

  ionViewDidLoad() {

    console.log(this._userserv._userProfile);

   this.user.displayName =this._userserv._userProfile.displayName;
   this.user.name = this._userserv._userProfile.name;
   this.user.surname  =this._userserv._userProfile.surname;
    console.log('ionViewDidLoad UserProfilePage');
  }

  doUpdateUserProfile(){
    this._loading= this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`,

    });
    this._loading.present();

    let userInfo = new UserProfile;
    userInfo.displayName = this.user.displayName;
    userInfo.name = this.user.name;
    userInfo.surname =  this.user.surname;
    this._userserv.updateUserInfo( userInfo).subscribe((res)=>{
     this._loading.dismiss();
     this.navCtrl.setRoot(HomePage);

    },(err)=>{
      this._loading.dismiss();
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })   

  }

}
