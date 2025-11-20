import { ApplicationRef, provideZoneChangeDetection } from '@angular/core';
import { enableDebugTools, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers]})
.then(moduleRef => {
	const applicationRef = moduleRef.injector.get(ApplicationRef);
	const componentRef = applicationRef.components[0];
	// allows to run `ng.profiler.timeChangeDetection();`
	enableDebugTools(componentRef);
});

