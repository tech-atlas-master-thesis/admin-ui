import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pipeline.component').then((m) => m.Pipeline),
  },
];
