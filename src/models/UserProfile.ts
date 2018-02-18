export class UserProfile{
    displayName:string;
    name:string;
    surname:string;
    credits:number;
    auto:UserAuto;
    constructor() {
        this.displayName='';
        this.name='';
        this.surname='';
        this.credits = 0;
        this.auto = new UserAuto();
    }
}

export class UserAuto {
    numberPlate:string;
    carBrend:string;
    carModel:string;
    carColor:string;
    constructor() {
        this.numberPlate='';
        this.carBrend='';
        this.carModel='';
        this.carColor='';
    }
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