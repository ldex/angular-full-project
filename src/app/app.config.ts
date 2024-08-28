import {
  ApplicationConfig,
  ErrorHandler,
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
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {
  provideAnimationsAsync
} from "@angular/platform-browser/animations/async";
import { JwtModule } from "@auth0/angular-jwt";

import {
  ProductService,
  ProductSignalService,
  FavouriteService,
  AuthService,
  AdminService,
  AuthInterceptor,
  CanDeactivateGuardService,
  CartService,
  CartSubjectService,
  DialogService,
  ErrorDialogService,
  ErrorService,
  LoadingDialogService,
  LoadingInterceptor,
  NetworkStatusService,
  NotificationService
} from "./services";
import { config, environment } from "src/environments/environment";
import { provideServiceWorker, ServiceWorkerModule } from "@angular/service-worker";
import { GlobalErrorHandler } from "./errors/global-error-handler";
import { HttpErrorInterceptor } from "./errors/http-error.interceptor";

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

const appInterceptors = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true,
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpErrorInterceptor,
        multi: true,
      },
      {
        provide: ErrorHandler,
        useClass: GlobalErrorHandler,
      }
]

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
  ServiceWorkerModule.register("ngsw-worker.js", {
    enabled: environment.production,
    // Register the ServiceWorker as soon as the app is stable
    // or after 30 seconds (whichever comes first).
    registrationStrategy: "registerWhenStable:30000",
  }),
];

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(...appModules),
    ...appInterceptors,
    ...appServices,
    provideHttpClient(withInterceptorsFromDi()),
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
    provideAnimationsAsync(),
  ],
};
