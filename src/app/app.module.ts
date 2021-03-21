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
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { ErrorHandlerModule } from './errors/error-handler.module';
import { NetworkStatusService } from './services/network-status.service';

export function GetToken(): string {
  return localStorage.getItem('auth_token');
}

const moduleImports = [
  BrowserModule,
  BrowserAnimationsModule,
  FormsModule,
  HttpClientModule,
  JwtModule.forRoot({
    config: {
      tokenGetter: GetToken,
      whitelistedDomains: ['localhost:10001', 'storerestservice.azurewebsites.net']
    }
  }),
  AppRoutingModule,
  MaterialModule,
  SharedModule,
  ErrorHandlerModule,
  ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
]

const moduleServices = [
  FavouriteService,
  LoginRouteGuardService,
  AuthService,
  AdminService,
  ErrorService,
  CartService,
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
