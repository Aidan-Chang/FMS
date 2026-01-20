import { Routes } from "@angular/router";

export const routes: Routes = [
  
];

export const mobileRoutes: Routes = [
  { path: 'capture', loadComponent: () => import('./page/capture').then(m => m.Capture), },
]