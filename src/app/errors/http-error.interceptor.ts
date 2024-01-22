import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, catchError, finalize, retry } from "rxjs";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(
      // If the call fails, retry up to 3 times
      retry({delay: 500, count: 3}),
      // It if still fails, then catch error and throw a specific error message
      catchError(this.handleError)
    );
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.error("Error from Http Error Interceptor", errorResponse);
    // Will be handled by GlobalErrorHandler
    return throwError(() => errorResponse);
  }
}
