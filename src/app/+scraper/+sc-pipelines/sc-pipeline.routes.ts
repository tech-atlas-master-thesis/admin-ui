import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sc-pipelines').then((m) => m.ScPipelines),
  },
];
