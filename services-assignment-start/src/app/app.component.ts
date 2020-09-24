import { Component } from '@angular/core';
import { CounterService } from './counterservice.services';
import { UsersService } from './usersservice.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsersService]
})
export class AppComponent {

  constructor(private usersService:UsersService,
              private counterService:CounterService) {}

  printStats() {
    this.counterService.printStats();
  }
}
