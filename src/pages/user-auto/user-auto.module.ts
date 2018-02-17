import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAutoPage } from './user-auto';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UserAutoPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAutoPage),
    TranslateModule.forChild()
  ],
})
export class UserAutoPageModule {}
