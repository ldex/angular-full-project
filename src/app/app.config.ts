import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from "@angular/core";
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withDebugTracing,
  withPreloading,
  withRouterConfig,
} from "@angular/router";

import { routes } from "./app.routes";
import {
  provideHttpClient,
  withInterceptors
} from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { JwtModule } from "@auth0/angular-jwt";

import {
  ProductService,
  ProductSignalService,
  FavouriteService,
  AuthService,
  AdminService,
  CanDeactivateGuardService,
  CartService,
  CartSubjectService,
  DialogService,
  ErrorDialogService,
  ErrorService,
  LoadingDialogService,
  NetworkStatusService,
  NotificationService
} from "./services";
import { config } from "src/environments/environment";
import { provideServiceWorker } from "@angular/service-worker";
import { provideAppErrorHandler } from "./errors/global-error-handler";
import { httpErrorInterceptor } from "./interceptors/http-error.interceptor";
import { authInterceptor } from "./interceptors/auth.interceptor";
import { loadingInterceptor } from "./interceptors/loading.interceptor";

const appServices = [
  ProductService,
  ProductSignalService,
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
  NetworkStatusService
];

const appModules = [
  BrowserModule,
  FormsModule,
  JwtModule.forRoot({
    config: {
      tokenGetter: () => {
        return localStorage.getItem(config.storageTokenKey);
      },
      allowedDomains: [
        "localhost:4200",
        "https://angular.wiremockapi.cloud/admin/",
      ],
    },
  }),
];

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(...appModules),
    ...appServices,
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
        httpErrorInterceptor,
      ])
    ),
    provideRouter(
      routes,
     // withDebugTracing(),
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
      withRouterConfig({ onSameUrlNavigation: "reload" })
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideAppErrorHandler()
  ],
};
