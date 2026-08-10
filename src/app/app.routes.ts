import { Routes } from '@angular/router';
import { PipelineApi } from '@api/service/pipeline-api';
import { DataSetsApi } from '@api/service/data-sets-api';
import { ConfigurationApi } from '@api/service/configuration-api';
import { PipelinesStore } from './+pipelines/pipelines.store';
import { ConfigurationsStore } from './+configurations/configurations.store';
import { DataSetsStore } from './+datasets/data-sets.store';

export const routes: Routes = [
  {
    path: 'pipelines',
    data: {
      breadcrumbKey: 'pipelines.breadcrumbKey',
    },
    providers: [PipelineApi, PipelinesStore],
    loadChildren: () => import('./+pipelines/pipelines.routes').then((m) => m.routes),
  },
  {
    path: 'configurations',
    data: {
      breadcrumbKey: 'configurations.breadcrumbKey',
    },
    providers: [ConfigurationApi, ConfigurationsStore],
    loadChildren: () => import('./+configurations/configurations.routes').then((m) => m.routes),
  },
  {
    path: 'datasets',
    data: {
      breadcrumbKey: 'dataSets.breadcrumbKey',
    },
    providers: [DataSetsApi, PipelineApi, DataSetsStore, PipelinesStore],
    loadChildren: () => import('./+datasets/data-sets.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadComponent: () => import('./+dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
