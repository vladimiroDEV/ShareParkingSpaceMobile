export class UserProfile{
    displayName:string;
    name:string;
    surname:string;
    credits:number;
    email:string;
    auto:UserAuto;
    userId:string;
    constructor() {
        this.displayName='';
        this.name='';
        this.surname='';
        this.credits = 0;
        this.email = "";
        this.userId ="";
        this.auto = new UserAuto();
    }
}

export class UserAuto {
    autoID:number;
    numberPlate:string;
    carBrend:string;
    carModel:string;
    carColor:string;
    constructor() {
        this.autoID= null;
        this.numberPlate='';
        this.carBrend='';
        this.carModel='';
        this.carColor='';
    }
}

export class UserPosition {
    lat: number;
    long: number;
    location: string;
}

export class Coordinates {
    autoID:number;
    id:number;
    lat:string;
    long:string;
    location:string;
    userId:string;
   constructor() {
       this.autoID= null;
       this.id = null;
       this.lat= '';
       this.long='';
       this.location='';
       this.userId = '';
   }

}

export class ParkingInfoVM {
    parkingID:number;
    userAuto:UserAuto;
    username:string;
    lat:number;
    lon:number;

    constructor() {
        this.parkingID = null;
        this.userAuto= new UserAuto();
        this.username='';
        this.lon=null;
        this.lat= null;
    }



}