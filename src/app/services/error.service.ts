import { Injectable } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class ErrorService {

  constructor(
    private locationStrategy: LocationStrategy
  ) {
  }

  log(error) {
    // Get error details
    const errorToSend = this.addContextInfo(error || {});
    // Send those details to server
    HttpService.LogToServer(errorToSend);
  }

  private addContextInfo(error) {
    const name = error.name || null;
    const appId = 'DemoApp';
    const user = 'Angular Academy'; // Get it from UserService if you have any...
    const time = new Date().getTime();
    const id = `${appId}-${user}-${time}`;
    const url = this.locationStrategy.path();
    const status = error.status || null;
    const message = error.message || error.toString();
    const stack = error instanceof HttpErrorResponse ? null : this.getStack(error);
    const errorWithContext = {name, appId, user, time, id, url, status, message, stack};
    return errorWithContext;
  }



  private getStack(error) {
      try {
          return StackTrace.fromError(error, {offline: true});
      } catch (error) {
          return '';
      }
  }
}


class HttpService {
    // Pretend that we send an error to the server...
  static LogToServer(error): Observable<any> {
    console.log('Error sent to the server: ', error);
    return of(error);
  }
}