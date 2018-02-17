export class UserProfile{
    displayName:string;
    name:string;
    surname:string;
    auto:UserAuto;
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