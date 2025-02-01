import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { finalize } from "rxjs";
import { LoadingDialogService } from "../services";

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loadingDialogService = inject(LoadingDialogService);

  loadingDialogService.openDialog();

  return next(request).pipe(
    finalize(() => {
      loadingDialogService.hideDialog();
    })
  );
};
