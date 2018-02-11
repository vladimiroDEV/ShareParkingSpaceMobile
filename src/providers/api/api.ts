import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable,  } from '@angular/core';
 import { Storage } from '@ionic/storage';
 import { Observable } from 'rxjs/Observable';


/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  //url: string = 'http://sahreparkingspaceapi.azurewebsites.net/api';
  url: string = 'https://localhost:44334/api';
  _token:string =''

  // reqOpts = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //     'Authorization': 'Bearer ' + this._token
  //   }
  // }

  reqOpts = new HttpHeaders();



  //  headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'Accept': 'application/json',
  // });

  constructor(public http: HttpClient, private _storage: Storage) {
    this.reqOpts.append('Content-Type', 'application/json');
    this.reqOpts.append('Accept', 'application/json');
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    let RequestOptions = {headers:this.getRequestOptions()}
  
     return this.http.get(this.url + '/' + endpoint, RequestOptions );
    
  }


  post(endpoint: string, body: any, reqOpts?: any) {
    

      return this.http.post(this.url + '/' + endpoint, body, {headers:this.getRequestOptions()});
 
    
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }
  

    getRequestOptions():HttpHeaders {
       let opt:HttpHeaders = new HttpHeaders();
      opt=  opt.append('Content-Type', 'application/json');
      opt=  opt.append('Accept', 'application/json');
    
        if(this._token) {
       //opt.append('Access-Control-Expose-Headers', 'Authorization');
        //  reqOpts.append('Authorization','Bearer '+ this._token);
     opt =  opt.set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QG1haWwuaXQiLCJqdGkiOiJhNjdjM2FkNy04NTdmLTQzODEtOGJlMi1kNWUwNGZmNWY5OWUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjY3OGRmNGU5LTA2YjEtNGZkMy1iNGQ2LTRjNmY3YzdlOTZjYyIsImV4cCI6MTUyMDk2NTUwOSwiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.VodsbldNmWFiih-9N2P_yodoMWiR2oL32WmU5dEhcLQ');
        
        }
        // console.log("Headers")
        // console.log(opt.get('Content-Type'))
        // console.log(opt.get('Accept'))
        // console.log(opt.get('Authorization'))
          
     return opt;
    }

    private getAuthToken():Observable<any> {
      return Observable.fromPromise(this._storage.get('token'));
    }
}
