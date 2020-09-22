import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-gamecontrol',
  templateUrl: './gamecontrol.component.html',
  styleUrls: ['./gamecontrol.component.css']
})
export class GamecontrolComponent implements OnInit {

  @Output() emitNumber = new EventEmitter<{type: string, value: number}>();

  number:number = 0;
  type:string = '';
  ref;

  constructor() { }

  ngOnInit(): void {
  }

  startGame() {
    this.ref = setInterval(()=>{
      this.number++;

      if(this.number % 2 == 0) {
        this.type = 'Even';
      } else {
        this.type = 'Odd';
      }

      this.emitNumber.emit({
        type: this.type,
        value: this.number
      });
     }, 1000);
  }
  
  stopGame(){
    clearInterval(this.ref);
  }
}
