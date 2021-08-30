import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// Note: This Interceptor is for reference only
// It is not needed anymore because it is now taken care of by the @auth0/angular-jwt library
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    // Get auth token (from local storage)
    authToken: string = this.authService.getToken();

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authToken) {
            // inject the auth token to the Http Headers
            const reqWithAuth = req.clone({
                setHeaders: { Authorization: 'Bearer ' + this.authToken }
             });
            return next.handle(reqWithAuth);
        }
        else {
            return next.handle(req);
        }
    }
}