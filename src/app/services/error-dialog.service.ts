import { Injectable, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorDialogComponent } from '../shared/error-dialog/error-dialog.component';

@Injectable()
export class ErrorDialogService {
  private dialog = inject(MatDialog);

  private opened = false;


  openDialog(message: string, status?: number): void {
    if (!this.opened) {
      this.opened = true;
      const dialogRef = this.dialog.open(ErrorDialogComponent, {
        data: { message, status },
        maxHeight: "100%",
        width: "540px",
        maxWidth: "100%",
        disableClose: true,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }
}
