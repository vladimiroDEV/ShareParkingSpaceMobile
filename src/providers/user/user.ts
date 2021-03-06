import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Api } from '../api/api';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import { UserProfile, UserAuto, UserPosition } from '../../models/UserProfile';


@Injectable()
export class User {
   
  _userProfile: UserProfile;
  _userPosition: UserPosition; 
  _token:string;

  constructor(public api: Api) {
    this._userProfile = new UserProfile(); 
   
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('AccountApi/login', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      //if (res.status == 'success') {
        if (res != null && res != '') {
          this.setToken(res);
           // this._storage.set('token', res);

       // this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('AccountApi/Register', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res != null && res != '') {
       // this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  getUserInfo(){
        return this.api.get('manageaccount/getuserinfo');
  }

  updateUserInfo(userProf:UserProfile) {
      return this.api.post('ManageAccount/UpdateUserProfile',{ 
          "DisplayName":userProf.displayName, 
          "Name":userProf.name, 
          "Surname":userProf.surname } )
  }

  updateUserAuto(auto: UserAuto) {
    return this.api.post('Manageaccount/UpdateAutoInfo',JSON.stringify(auto) )
  }

  refillCredit(credit:number) {
    return this.api.post('manageaccount/UpdateUserCredit',{  "Credit":credit, "Action":1 } )
  }

  addParkingSpace(lat:number,lng:number, locality:string){

    return this.api.post('ParkingSpaces/addParkingSpace',{ 
         "Lat": lat,
         "Long":lng,
         "Location":locality} )
  }

  GetParkingSpaces(location:string){
    return this.api.get('ParkingSpaces/GetParkingSpaces/'+location);
  }

  GetParkingSpace(parkingId) {
    return this.api.get('ParkingSpaces/GetParkingSpceInfo/'+parkingId);
  }

  ReserveParkingSpace(parkingId:number, autoId:number) {
    return this.api.post('ParkingSpaces/ReserveParkingSpace', {
      "parkingID": parkingId,
      "AutoID": autoId
    });
  }
  PaidForParkingSpace(parkingId) {
    return this.api.post('ParkingSpaces/PaidForParkingSpace',{
      'ID':parkingId
    });
  }

  getMySharedParking(userId:string) {
    return this.api.get('ParkingSpaces/getMySharedParking/'+userId);
  }

  deleteMySharedParking() {
    return this.api.post('ParkingSpaces/DeleteMySharedParking/', {"userID":this._userProfile.userId});
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._userProfile = null;
    this._userPosition = null;
    this._token = "";
  }

  /**
   * Process a login/signup response to store user data
   */
  // _loggedIn(resp) {
  //   this._user = resp.user;
  // }

  /**
   * Return auth token from promise
   */

    setToken(token){
    this.api._token = token;
    this._token = token;
   
  }

  setUserProfiile(userProfile: UserProfile) {
    this._userProfile = userProfile;

  }


}
