import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';
import { config } from '../../environments/environment';

interface LoginResponse {
  error: string,
  token: string
}

@Injectable()
export class AuthService {

  private loggedIn: boolean = false;
  private readonly storageTokenKey: string = 'auth_token';
  private baseUrl: string = config.authUrl;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) {
  }

  login(username: string, password: string): Observable<boolean> {

    let body = {
      email: username,
      password: password
    };

    // Use http and your backend to async authenticate the user
    // If no error, you get back a security token
    return this.http
      .post<LoginResponse>(this.baseUrl, body)
      .pipe(
        map(
          response => {
            if (response.error) {
              console.error(response.error);
              return false;
            } else {
              this.storeToken(response.token);
              this.loggedIn = true;
              return true;
            }
          }
        ),
        catchError(err => {
          console.error(err);
          return of(false);
        })
      );
  }

  logout(): void {
    this.removeTokens();
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {

    const token: string = this.getToken();

    if (token != null && this.loggedIn) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  private storeToken(token) {
    // Store the token locally  in Local Storage (HTML5)
    // Check in Chrome Dev Tools / Application / Local Storage
    localStorage.setItem(this.storageTokenKey, token);
  }

  private getToken(): string {
    return localStorage.getItem(this.storageTokenKey);
  }

  private removeTokens() {
    localStorage.removeItem(this.storageTokenKey);
  }
}
