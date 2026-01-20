import { Routes } from "@angular/router";
import { scalar, elmah, hangfire } from './style/api';

export const routes: Routes = [
  { path: 'translate', loadComponent: () => import('@fms/svc/ux').then(m => m.IFramePage), },
  { path: 'api', loadComponent: () => import('@fms/svc/ux').then(m => m.IFramePage), data: { url: '/docs', style: scalar } },
  { path: 'log', loadComponent: () => import('@fms/svc/ux').then(m => m.IFramePage), data: { url: '/elmah', style: elmah } },
  { path: 'task', loadComponent: () => import('@fms/svc/ux').then(m => m.IFramePage), data: { url: '/hangfire', style: hangfire } },
];
