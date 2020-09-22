import { Component } from '@angular/core';

@Component({
    selector: 'app-alerts',
    templateUrl: 'alert.component.html',
    styles: [`
      .white-text {
        color:white;
      }
    `]
})
export class AlertComponent {
  //Assignment #2
  username = '';

  checkUsername() {
    if(this.username == null || this.username.trim() === '') {
      return true;
    }
    
    return false;
  }

  resetUsername() {
    this.username = '';
  }


  //Assignment #3
  toggle = true;
  clickArray = [];

  logClick() {
    this.toggle == true ? this.toggle = false : this.toggle = true;
    this.clickArray.push(new Date());
  }
}