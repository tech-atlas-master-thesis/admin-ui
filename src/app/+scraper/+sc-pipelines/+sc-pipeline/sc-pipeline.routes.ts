import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sc-pipeline').then((m) => m.ScPipeline),
  },
];
