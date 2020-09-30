import { Component, ComponentFactoryResolver, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, onErrorResumeNext, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from '../shared/services/auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholer/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {

    constructor(private authService:AuthService,
                private router: Router,
                private cFR: ComponentFactoryResolver) {}

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective; 

    private closeSub: Subscription;

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if(!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;
        
        let authObs:Observable<AuthResponseData>; 

        this.isLoading = true;
        
        if(this.isLoginMode) {
            authObs = this.authService
            .login(email, password);
        } else {
            authObs = this.authService
            .signup(email, password);
        }

        authObs
        .subscribe(responseData => {
            console.log(responseData);
            this.isLoading = false;
            this.router.navigate(['./recipes']);
        }, errorMessage => {
            this.error = errorMessage;
            this.showErrorAlert(errorMessage);
            this.isLoading = false;
        });

        form.reset();
    }

    onHandleError() {
        this.error = null;
    }

    // Component Programmatic creation method (no *ngIf)
    private showErrorAlert(message: string) {
        const alertCmpFactory = this.cFR.resolveComponentFactory(AlertComponent);
    
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy() {
        if(this.closeSub) {
            this.closeSub.unsubscribe();
        }
    }
}