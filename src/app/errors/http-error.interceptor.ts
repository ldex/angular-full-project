import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize, retry } from "rxjs/operators";

import { ErrorDialogService } from '../services/error-dialog.service';
import { LoadingDialogService } from '../services/loading-dialog.service';
import { delayedRetry } from '../delayedRetry.operator';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorDialogService: ErrorDialogService,
    private loadingDialogService: LoadingDialogService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingDialogService.openDialog();
    return next.handle(request)
    .pipe(
      // If the call fails, immediately retry up to 5 times
      retry(5),
      // Even better with a custom operator!
      //delayedRetry(500, 3),
      // Then catch error and throw a specific error message
      catchError(this.handleError),
      finalize(() => {
        this.loadingDialogService.hideDialog();
      })
    );
  }

  private handleError(errorResponse: HttpErrorResponse) {    
    console.error("Error from Http Error Interceptor", errorResponse);
    this.errorDialogService.openDialog(errorResponse.message ?? JSON.stringify(errorResponse), errorResponse.status);
    return throwError(errorResponse);
  }  
}
