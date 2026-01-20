import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { profilerInterceptor } from '@fms/svc/core';

import { routes } from './app.routes';
import { preset } from './app.preset';
import { PROPERTY } from '@fms/svc/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        profilerInterceptor,
      ])),
    providePrimeNG({
      theme: {
        preset: preset,
        options: {
          darkModeSelector: '.app-dark',
        },
      }
    }),
    {
      provide: PROPERTY, useValue: {
        name: 'FMS',
        version: '10.26.1.3',
        owner: 'machan',
      }
    },
  ]
};
