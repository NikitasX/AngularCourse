import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface AuthResponseData {
    kind : string;
    idToken : string;
    email : string;
    refreshToken : string;
    expiresIn : string;
    localId : string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient,
                private router: Router) {}

    // Error handling helper method
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';

        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct!';
                break;
        }
        return throwError(errorMessage);
    }

    // Get use data and Pass next user on the subject. Store user Data in
    // local storage for auto login, set a timer for the autologout
    private handleAuthentication
    (email: string, userId:string, token:string, expiresIn: number) 
    {
        
        const expirationDate = new Date(
            new Date().getTime() + +expiresIn * 1000
        );
        const user = new User(
            email, 
            userId,
            token,
            expirationDate);

        this.user.next(user);

        this.autoLogout(expiresIn * 1000);

        localStorage.setItem('userData', JSON.stringify(user));
    }

    // Send http req to signup, go to handle error if error, else send
    // data to handle authentication 
    signup(email:string, password: string) {
        return this.http
            .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDrvxm8o70PtthpUDP9Gze5YxwO5NcANxI',
            {
                email : email,
                password : password,
                returnSecureToken : true
            }
        ).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId,
                resData.idToken,
                +resData.expiresIn);
        }));
    }

    // Send http login request, go to handleError if error else send
    // data to handleAuthentication
    login(email:string, password:string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDrvxm8o70PtthpUDP9Gze5YxwO5NcANxI',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId,
                resData.idToken,
                +resData.expiresIn);
        }));
    }

    // Pass a next user on the subject and navigate to authentication page
    // & clear timer
    logout() {
        this.user.next(null);
        
        this.router.navigate(['/auth']);
        
        localStorage.removeItem('userData');

        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    // Check if the user data is stored in local storage and login
    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        
        if(!userData) {
            return;
        }

        const loadedUser = new User
        (userData.email, userData.id, 
        userData._token, new Date(userData._tokenExpirationDate));

        if(loadedUser.token) {

            this.user.next(loadedUser);

            const expirationDuration = 
            new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

            this.autoLogout(expirationDuration);
        }
    }

    // set a timer in ms. After that amount of time has passed, Log the
    // user out 
    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }
}