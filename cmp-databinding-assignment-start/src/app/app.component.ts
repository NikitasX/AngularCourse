import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  evenNumber = [];
  oddNumber = [];

  gameStarted(number: {type: string, value:number}){
    number.type == 'Odd' ? this.oddNumber.push(number) : this.evenNumber.push(number);
  }
}
