import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-error-dialog",
    templateUrl: "./error-dialog.component.html",
    styleUrls: ["./error-dialog.component.css"],
    imports: [MatDialogModule, MatButtonModule]
})
export class ErrorDialogComponent {
  data = inject<{
    message: string;
    status?: number;
}>(MAT_DIALOG_DATA);

}
