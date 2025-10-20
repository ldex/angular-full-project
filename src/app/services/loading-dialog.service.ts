import { Injectable, inject } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { LoadingDialogComponent } from '../shared/loading-dialog/loading-dialog.component';

@Injectable()
export class LoadingDialogService {
  private dialog = inject(MatDialog);

  private opened = false;
  private dialogRef: MatDialogRef<LoadingDialogComponent>;


  openDialog(): void {
    if (!this.opened) {
      this.opened = true;
      this.dialogRef = this.dialog.open(LoadingDialogComponent, {
        data: undefined,
        maxHeight: "100%",
        width: "400px",
        maxWidth: "100%",
        disableClose: true,
        hasBackdrop: true
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.opened = false;
      });
    }
  }

  hideDialog() {
    this.dialogRef.close();
  }
}
