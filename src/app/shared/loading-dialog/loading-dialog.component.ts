import { Component } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
    selector: "app-loading-dialog",
    templateUrl: "./loading-dialog.component.html",
    styleUrls: ["./loading-dialog.component.css"],
    standalone: true,
    imports: [MatDialogModule, MatProgressSpinnerModule]
})
export class LoadingDialogComponent {
  constructor() {}
}
