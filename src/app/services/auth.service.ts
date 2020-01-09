import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt';

interface LoginResponse {
  error: string,
  token: string
}

@Injectable()
export class AuthService {

  private loggedIn: boolean = false;
  private storageTokenKey: string = 'auth_token';
  // Use mocky to fake auth from server
  private baseUrl: string = 'http://www.mocky.io/v2/5b9149823100002a00939952';

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService) {
  }

  login(username: string, password: string): Observable<boolean> {
    let tokenFromServer: string;

    let body = {
      email: username,
      password: password
    };

    // Use http and your backend to async authenticate the user
    // Get back a security token
    return this.http
      .post<LoginResponse>(this.baseUrl, body)
      .pipe(
        map(
          response => {
            if(response.error) {
              return false;
            } else {
              tokenFromServer = response.token;
              // Store the token locally  in Local Storage (HTML5)
              // Check in Chrome Dev Tools / Application / Local Storage
              localStorage.setItem(this.storageTokenKey, tokenFromServer);
              this.loggedIn = true;
              return true;
            }
          }
        )
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageTokenKey);
    this.loggedIn = false;
  }

  public getToken(): string {
    return localStorage.getItem(this.storageTokenKey);
  }

  isLoggedIn(): boolean {

    let token: string = this.getToken();

    if(this.loggedIn && token != null) {
      return !this.jwtHelper.isTokenExpired(token);
    }

    return false;
  }
}
