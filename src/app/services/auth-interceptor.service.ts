import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private storageTokenKey: string = 'auth_token';

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
        // Get security token from local storage
        const authToken = localStorage.getItem(this.storageTokenKey);      

        return next.handle(req);

        // The following is taken care ob by the @auth0/angular-jwt library
        // if (authToken) {

        //     // inject the token to the Http Headers
        //     const headers = req.headers.set('Authorization', 'Bearer ' + authToken);

        //     const cloned = req.clone({ headers });

        //     return next.handle(cloned);
        // }
        // else {
        //     return next.handle(req);
        // }
    }
}