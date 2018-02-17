import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditPage } from './credit';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreditPage,
  ],
  imports: [
    IonicPageModule.forChild(CreditPage),
    TranslateModule.forChild()
  ],
})
export class CreditPageModule {}
