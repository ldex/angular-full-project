import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { ErrorService } from './error.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(
    private injector: Injector,
    private notificationService: NotificationService,
    private errorService: ErrorService
    ) {
    super();
  }

  handleError( error: Error | HttpErrorResponse ) {

    // ErrorHandler instanciated before Router!
    // We get if from the injector at runtime
    const router = this.injector.get(Router);

    if (!navigator.onLine) {
      // Handle offline error
        this.notificationService.notifyError('No Internet Connection');
    } else {
      if (error instanceof HttpErrorResponse) {
        // Handle Http Error (error.status === 403, 404...)
        // Send the error to the server
        this.errorService.log(error).subscribe();
        this.notificationService.notifyError(`${error.status} - ${error.message}`);
      } else {
        // Handle Client Error (Angular Error, ReferenceError...)
        // Send the error to the server and then redirect the user to the page with all the info
        this.errorService
        .log(error)
        .subscribe(errorWithContextInfo => {
          router.navigate(['/error'], { state: errorWithContextInfo });
        });
      }
    }

    // Let Angular log the error anyway
    super.handleError( error );
  }
}