import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MaterialModule } from '../material/material.module';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { NotificationComponent } from './notification/notification.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home.component';
import { AdminComponent } from './pages/admin.component';
import { ContactComponent } from './pages/contact.component';
import { LoginComponent } from './pages/login.component';
import { ErrorComponent } from './pages/error.component';
import { TestComponent } from "./pages/test.component";
import { DemoWorkerComponent } from "./pages/demo-worker.component";
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';

const pagesComponents = [
  HomeComponent,
  AdminComponent,
  ContactComponent,
  LoginComponent,
  ErrorComponent,
  TestComponent,
  DemoWorkerComponent
];

@NgModule({
  declarations: [
    ...pagesComponents,
    LoadingDialogComponent,
    ErrorDialogComponent,
    NotificationComponent,
    ModalDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    ...pagesComponents,
    LoadingDialogComponent,
    ErrorDialogComponent,
    NotificationComponent,
    ModalDialogComponent
  ]
})
export class SharedModule {}
