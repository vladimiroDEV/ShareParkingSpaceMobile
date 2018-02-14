import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindParkingMapPage } from './find-parking-map';

@NgModule({
  declarations: [
    FindParkingMapPage,
  ],
  imports: [
    IonicPageModule.forChild(FindParkingMapPage),
  ],
})
export class FindParkingMapPageModule {}
