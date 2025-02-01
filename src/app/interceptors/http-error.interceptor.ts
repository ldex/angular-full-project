import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from "@angular/common/http";
import { throwError, catchError, retry } from "rxjs";

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    // If the call fails, retry up to 3 times
    retry({ delay: 500, count: 3 }),
    // It if still fails, then catch error and throw a specific error message
    catchError((error: HttpErrorResponse) => {
      console.error("Error from Http Error Interceptor", error);
      // Will be handled by GlobalErrorHandler
      return throwError(() => error);
    })
  );
};
