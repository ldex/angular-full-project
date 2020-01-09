import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { ErrorService } from './error.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  // Since ErrorHandler is created before the providers, we’ll have to use the Injector to get them.
  constructor(
    private injector: Injector) {
    super();
  }

  handleError( error: Error | HttpErrorResponse ) {

    const notificationService = this.injector.get(NotificationService);
    const errorService = this.injector.get(ErrorService);
    const router = this.injector.get(Router);
    const ngZone = this.injector.get(NgZone);

    if (!navigator.onLine) {
      // Handle offline error
        notificationService.notifyError('No Internet Connection');
    } else {
      if (error instanceof HttpErrorResponse) {
        // Handle Http Error (error.status === 403, 404...)
        // Send the error to the server
        errorService.log(error).subscribe();
        notificationService.notifyError(`${error.status} - ${error.message}`);
      } else {
        // Handle Client Error (Angular Error, ReferenceError...)
        // Send the error to the server and then redirect the user to the page with all the info
        errorService
        .log(error)
        .subscribe(errorWithContextInfo => {
          ngZone.run(
            () => {
              router.navigate(['/error'], { queryParams: errorWithContextInfo });
            }
          );
        });
      }
    }

    // Let Angular log the error anyway
    super.handleError( error );
  }
}