import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}


const handleAuthentication = (email: string, id: string, token: string, expiresIn: number) => {

  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);

  const user  = new User(email, id, token, expirationDate);

  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.Authenticate_Success({
      email: email,
      userId: id,
      token: token,
      expirationDate: expirationDate
  });

};

const handleError = (errorRes: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!errorRes.error || !errorRes.error.error) {
    return of(new AuthActions.Authenticate_Fail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct.';
      break;
  }
  return of(new AuthActions.Authenticate_Fail(errorMessage));
};

@Injectable()
export class AuthEffects {
    
    constructor(
      private actions$: Actions, 
      private http: HttpClient, 
      private router: Router, 
      private authService: AuthService) {}

    @Effect()
    authSignup = this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http
        .post<AuthResponseData>(
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' +
            environment.firebaseAPIKey,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
          }
        )
        .pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }), 
          map(resData => {
            return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
      })
    )


    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
            .post<AuthResponseData>(
              'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' +
                environment.firebaseAPIKey,
              {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
              }
            )
            .pipe(
              tap(resData => {
                this.authService.setLogoutTimer(+resData.expiresIn * 1000);
              }), 
              map(resData => {
                return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
              }),
              catchError(errorRes => {
                return handleError(errorRes);
              })
            );
        })
    );

      
    @Effect()
    autoLogin = this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {

        // Retrieve data from the Local Storage
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        // If data is empty, return.
        if (!userData) {
          return { type: 'DUMMY' };
        }
    
        // Create a user with the loaded data
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
    
        // If the token exists, authenticate the user on the server
        // if correct, log him in. Check if his token has expired on the
        // auto logout function.
        if (loadedUser.token) {
    
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();

          this.authService.setLogoutTimer(expirationDuration);

          return new AuthActions.Authenticate_Success({
              email: loadedUser.email,
              userId: loadedUser.id,
              token: loadedUser.token,
              expirationDate: new Date(userData._tokenExpirationDate)
            });
          
    
          // const expirationDuration =
          //   new Date(userData._tokenExpirationDate).getTime() -
          //   new Date().getTime();
          // this.autoLogout(expirationDuration);
    
        }
        return { type: 'DUMMY' };
      })
    );


    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap(() => {
        this.router.navigate(['/']);
    }));

    @Effect({ dispatch:false })
    authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    }));

}