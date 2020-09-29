import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { DataStorageService } from '../shared/services/data-storage.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    isAuthenticated = false;
    private userSub: Subscription;

    constructor(private storageService: DataStorageService,
                private authService: AuthService) {}

    collapsed = true;

    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
            console.log(user);
            this.isAuthenticated = !user ? false : true;
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    onSaveData() {
        this.storageService.storeRecipes();
    }

    onFetchData() {
        this.storageService.fetchRecipes().subscribe();
    }
}