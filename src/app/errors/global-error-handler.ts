import { EnvironmentProviders, ErrorHandler, Injectable, makeEnvironmentProviders, inject } from "@angular/core";
import { ErrorService } from "../services";
import { ErrorDialogService } from "../services/error-dialog.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorDialogService = inject(ErrorDialogService);
  private errorService = inject(ErrorService);


  handleError(error: Error) {
    // Handle Client Error (Angular Error, ReferenceError...)
    this.errorService.log(error);
    this.errorDialogService.openDialog(
      error?.message || "Undefined client error"
    );
    console.error("Error from global error handler", error);
  }
}

export function provideAppErrorHandler(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]);
}
