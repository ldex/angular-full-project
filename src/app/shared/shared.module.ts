import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialModule } from '../material/material.module';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { NotificationComponent } from './notification/notification.component';

const pagesComponents = [
];

@NgModule({
  declarations: [
    ...pagesComponents,
    LoadingDialogComponent,
    ErrorDialogComponent,
    NotificationComponent
  ],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [
    ...pagesComponents,
    LoadingDialogComponent,
    ErrorDialogComponent,
    NotificationComponent
  ],
  entryComponents: [
    LoadingDialogComponent,
    ErrorDialogComponent,
    NotificationComponent]
})
export class SharedModule {}
