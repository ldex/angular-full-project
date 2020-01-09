import {Observable, of, throwError} from 'rxjs';
import {delay, mergeMap, retryWhen, tap} from 'rxjs/operators';

const getErrorMessage = (maxRetry: number) =>
  `Tried to load Resource over XHR for ${maxRetry} times without success. Giving up`;

const DEFAULT_MAX_RETRIES = 5;

export function delayedRetry(delayMs: number, maxRetry = DEFAULT_MAX_RETRIES) {
  let retries = maxRetry;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors: Observable<any>) => errors.pipe(
        delay(delayMs),
        mergeMap(error => retries-- > 0 ? of(error) : throwError(getErrorMessage(maxRetry))
        ))
      )
    );
}