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
export class UserAutoHub {
    AutoID:number;
    NumberPlate:string;
    CarBrend:string;
    CarModel:string;
    CarColor:string;
    constructor() {
        this.AutoID= null;
        this.NumberPlate='';
        this.CarBrend='';
        this.CarModel='';
        this.CarColor='';
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

export class MyParkingVM {
    userAuto:UserAuto;
    username:string;
    lng:number
    lat:number;
    constructor(){
        this.userAuto = new UserAuto();
        this.username = "";
        this.lng = null;
        this.lat= null;

    }
}
export class MyParkingVMHub {
    UserAuto:UserAutoHub;
    Username:string;
    Lng:number
    Lat:number;
    constructor(){
        this.UserAuto = new UserAutoHub();
        this.Username = "";
        this.Lng = null;
        this.Lat= null;

    }
}

export class MySharePosition{
      isShared:boolean;
      username:string;
      auto:UserAuto;
      isReserved: boolean;
      Citta:string ; 
       Via:string;

       constructor(){
           this.Via ="";
           this.Citta = "";
           this.isShared = false;
           this.isReserved = false;
           this.username="";
           this.auto = null;
       }
     }