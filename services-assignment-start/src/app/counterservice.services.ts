import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class CounterService {
    toInactiveClicks = 0;
    toActiveClicks = 0;

    toInactive() {
        this.toInactiveClicks++;
    }

    toActive() {
        this.toActiveClicks++;
    }

    printStats(){
        console.log(this.toActiveClicks + ' Inactive -> Active clicks!');
        console.log(this.toInactiveClicks + ' Active -> Inactive clicks!');
    }
}