import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAutoPage } from './user-auto';

@NgModule({
  declarations: [
    UserAutoPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAutoPage),
  ],
})
export class UserAutoPageModule {}
