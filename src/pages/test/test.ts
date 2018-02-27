import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HubConnection} from '@aspnet/signalr-client';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage implements OnInit{

  ngOnInit(): void {
          
      let connection = new HubConnection('https://localhost:44334/message');

      connection.on('send', data => {
          console.log(data);
      });
      

connection.start()
                .then(() => {
                   console.log("connected");
                   connection.invoke("JoinGroup", "Roma");
                   
                  });
                console.log(connection);

          // .then(() => connection.invoke('send', 'Hello'));
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

}
