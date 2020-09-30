import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../shared/services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router) {}


    // Implement can activate to pass this to app-routing as a guard.
    // Can activate normally returns boolean, Promise<boolean>, Observable<boolean>
    // However later versions include UrlTree which is used for redirects.

    // In this case we pass true if user is Authenticated and a url tree with a path
    // if the user is not!
    canActivate
    (route: ActivatedRouteSnapshot, router: RouterStateSnapshot) : 
    boolean | 
    UrlTree | 
    Promise<boolean | UrlTree> | 
    Observable<boolean | UrlTree>
    {
        return this.authService.user.pipe(
            take(1),
            map(user => {
            const isAuth = !!user;
            if(isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        }));
    }
}