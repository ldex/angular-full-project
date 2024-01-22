import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingDialogService } from './loading-dialog.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loadingDialogService: LoadingDialogService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingDialogService.openDialog();
        return next.handle(request)
        .pipe(
          finalize(() => {
            this.loadingDialogService.hideDialog();
          })
        );
    }
}