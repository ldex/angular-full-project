import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './material/material.module';

import { JwtModule } from '@auth0/angular-jwt';

import {
  ErrorService,
  AdminService,
  FavouriteService,
  DialogService,
  NotificationService,
  CartService,
  LoginRouteGuardService,
  CanDeactivateGuardService,
  LoadingDialogService,
  ErrorDialogService,
  AuthService }
  from './services';

import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { config, environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ErrorHandlerModule } from './errors/error-handler.module';
import { NetworkStatusService } from './services/network-status.service';
import { CartSubjectService } from './services/cart.subject.service';

export function GetToken(): string {
  return localStorage.getItem(config.storageTokenKey);
}

const moduleImports = [
  BrowserModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  JwtModule.forRoot({
    config: {
      tokenGetter: GetToken,
      allowedDomains: ['localhost:10001', 'storerestservice.azurewebsites.net']
    }
  }),
  AppRoutingModule,
  MaterialModule,
  SharedModule,
  ErrorHandlerModule,
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
    // Register the ServiceWorker as soon as the app is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: 'registerWhenStable:30000'
  }),
]

const moduleServices = [
  FavouriteService,
  LoginRouteGuardService,
  AuthService,
  AdminService,
  ErrorService,
  CartService,
  CartSubjectService,
  NotificationService,
  CanDeactivateGuardService,
  DialogService,
  LoadingDialogService,
  ErrorDialogService,
  NetworkStatusService
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...moduleImports
  ],
  providers: [
    ...moduleServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
