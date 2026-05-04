import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    data: { breadcrumbKey: undefined },
    path: '',
    loadComponent: () => import('./data-set.component').then((m) => m.DataSetComponent),
  },
];
