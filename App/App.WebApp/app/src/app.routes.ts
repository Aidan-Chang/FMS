import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'login', loadComponent: () => import('@fms/lib/sme/account').then(c => c.Login) },
  { path: '', loadComponent: () => import('./layout/layout').then(c => c.Layout), children: [
    { path: 'home', loadComponent: () => import('./page/home').then(c => c.Home) },
    { path: 'tqm', children: [
        { path: 'track', loadChildren: () => import('@fms/lib/tqm/track').then(m => m.routes) },
      ]
    },
    { path: 'sme', children: [
      { path: 'account', loadChildren: () => import('@fms/lib/sme/account').then(m => m.routes) },
      { path: 'server', loadChildren: () => import('@fms/lib/sme/server').then(m => m.routes) },
    ] },
  ], },
  { path: 'm', loadComponent:() => import('@fms/svc/mobile').then(c => c.MobileLayout), children: [
    { path: '', pathMatch: 'full', redirectTo: '/m/home' },
    { path: 'home', loadComponent: () => import('./page/home').then(c => c.Home) },
    { path: 'tqm', children: [
      { path: 'track', loadChildren: () => import('@fms/lib/tqm/track').then(m => m.mobileRoutes) },
    ], },
  ], },
  { path: '**', loadComponent: () => import('./page/404').then(c => c.PageNotFound) }
];
