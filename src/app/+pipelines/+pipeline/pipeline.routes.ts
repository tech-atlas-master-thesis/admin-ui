import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    data: { breadcrumbKey: undefined },
    path: '',
    loadComponent: () => import('./pipeline.component').then((m) => m.Pipeline),
  },
];
