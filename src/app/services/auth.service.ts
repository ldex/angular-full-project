import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, map, catchError } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { config } from "../../environments/environment";

interface AuthResponse {
  error: string;
  token: string;
}

@Injectable()
export class AuthService {
  private readonly storageTokenKey: string = config.storageTokenKey;
  private baseUrl: string = config.authUrl;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  login(username: string, password: string): Observable<boolean> {
    // Use http and your backend to async authenticate the user
    // If no error, you get back a security token
    return this.http
      .post<AuthResponse>(this.baseUrl, { username, password })
      .pipe(
        map((response) => {
          if (response.error) {
            console.error(response.error);
            return false;
          } else {
            this.storeToken(response.token);
            return true;
          }
        }),
        catchError((err) => {
          console.error(err);
          return of(false);
        })
      );
  }

  logout(): void {
    this.removeTokens();
  }

  isLoggedIn(): boolean {
    const token: string = this.getToken();

    if (token != null) {
      return !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  private storeToken(token) {
    // Store the token locally  in Local Storage (HTML5)
    // Check in Chrome Dev Tools / Application / Local Storage
    localStorage.setItem(this.storageTokenKey, token);
  }

  public getToken(): string {
    return localStorage.getItem(this.storageTokenKey);
  }

  private removeTokens() {
    localStorage.removeItem(this.storageTokenKey);
  }
}
