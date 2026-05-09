import { Routes } from '@angular/router';
import { PipelinesStore } from '../+pipelines/pipelines.store';
import { ConfigurationsStore } from '../+configurations/configurations.store';

export const routes: Routes = [
  {
    path: 'pipelines',
    data: {
      breadcrumbKey: 'pipelines.breadcrumbKey',
    },
    providers: [PipelinesStore],
    loadChildren: () => import('../+pipelines/pipelines.routes').then((m) => m.routes),
  },
  {
    path: 'configurations',
    data: {
      breadcrumbKey: 'configurations.breadcrumbKey',
    },
    providers: [ConfigurationsStore],
    loadChildren: () => import('../+configurations/configurations.routes').then((m) => m.routes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pipelines',
  },
];
