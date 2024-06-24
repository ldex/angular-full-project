import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withDebugTracing, withPreloading, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { ProductService, FavouriteService, AuthService, AdminService, AuthInterceptor, CanDeactivateGuardService, CartService, CartSubjectService, DialogService, ErrorDialogService, ErrorService, LoadingDialogService, LoadingInterceptor, NetworkStatusService, NotificationService } from './services';
import { config, environment } from 'src/environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ErrorHandlerModule } from './errors/error-handler.module';

const moduleServices = [
    FavouriteService,
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
    NetworkStatusService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
  const moduleImports = [
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      JwtModule.forRoot({
          config: {
                tokenGetter: () => {
                    return localStorage.getItem(config.storageTokenKey);
                },
              allowedDomains: ['localhost:4200', 'https://angular.wiremockapi.cloud/admin/']
          }
      }),
      ErrorHandlerModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the app is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
      }),
  ]


export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(...moduleImports),
        ...moduleServices,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(
            routes,
            withDebugTracing(),
            withComponentInputBinding(),
            withPreloading(PreloadAllModules),
            withRouterConfig({onSameUrlNavigation: 'reload'})
        ),
        provideAnimations()
    ]
};