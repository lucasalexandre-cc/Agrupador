import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Keys } from './keys.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  constructor(){}

  /* 
      Estabelecendo conexao da aplicacao com o Firebase.
  */
  ngOnInit():void{
    let keys:Keys = new Keys();
    var config = {
      apiKey: keys.apiKey,
      authDomain: keys.authDomain,
      databaseURL: keys.databaseURL,
      projectId: keys.projectId,
      storageBucket: "",
      messagingSenderId: keys.messagingSenderId
    };
    firebase.initializeApp(config);
  }
}
