import { Routes } from '@angular/router';
import { PipelinesStore } from '../+pipelines/pipelines.store';
import { DataSetsStore } from './+datasets/data-sets.store';
import { ConfigurationStore } from '../+configurations/+configuration-versions/configuration.store';

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
    providers: [ConfigurationStore],
    loadChildren: () => import('../+configurations/configurations.routes').then((m) => m.routes),
  },
  {
    path: 'datasets',
    data: {
      breadcrumbKey: 'dataSets.breadcrumbKey',
    },
    providers: [DataSetsStore, PipelinesStore],
    loadChildren: () => import('./+datasets/data-sets.routes').then((m) => m.routes),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pipelines',
  },
];
