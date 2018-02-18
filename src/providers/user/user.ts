import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Api } from '../api/api';
// import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import { UserProfile, UserAuto } from '../../models/UserProfile';


@Injectable()
export class User {
   
  _userProfile: UserProfile;
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

  addParkingSpace(lat:number, long:number, location:string){
    return this.api.post('ParkingSpaces/addParkingSpace',{  "Lat":lat, "Long": long, "Location":location } )
  }

  GetParkingSpaces(location:string){
    return this.api.get('ParkingSpaces/GetParkingSpaces/'+location);
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    //this._user = null;
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
