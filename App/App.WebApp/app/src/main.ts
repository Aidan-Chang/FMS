import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppPage } from './app.page';

bootstrapApplication(AppPage, appConfig)
  .catch((err) => console.error(err));
