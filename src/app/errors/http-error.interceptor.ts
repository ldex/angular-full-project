import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError, catchError, finalize, retry } from "rxjs";
import { LoadingDialogService } from '../services';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private loadingDialogService: LoadingDialogService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingDialogService.openDialog();
    return next.handle(request)
    .pipe(
      // If the call fails, retry up to 3 times
      retry({delay: 500, count: 3}), // New syntax since RxJS 7
      // Then catch error and throw a specific error message
      catchError(this.handleError),
      finalize(() => {
        this.loadingDialogService.hideDialog();
      })
    );
  }

  private handleError(errorResponse: HttpErrorResponse) {
    console.error("Error from Http Error Interceptor", errorResponse);
    // Will be handled by GlobalErrorHandler
    return throwError(() => errorResponse.message);
  }
}
