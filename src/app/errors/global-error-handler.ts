import { ErrorHandler, Injectable } from "@angular/core";
import { ErrorService } from "../services";
import { ErrorDialogService } from "../services/error-dialog.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private errorDialogService: ErrorDialogService,
    private errorService: ErrorService
  ) {}

  handleError(error: Error) {
    // Handle Client Error (Angular Error, ReferenceError...)
    this.errorService.log(error);
    this.errorDialogService.openDialog(
      error?.message || "Undefined client error"
    );
    console.error("Error from global error handler", error);
  }
}
