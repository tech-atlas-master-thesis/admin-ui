import { Routes } from '@angular/router';
import { PipelineApi } from '@api/service/pipeline-api';
import { DataSetsApi } from '@api/service/data-sets-api';
import { ConfigurationApi } from '@api/service/configuration-api';
import { PipelinesStore } from './+pipelines/pipelines.store';
import { ConfigurationsStore } from './+configurations/configurations.store';
import { DataSetsStore } from './+datasets/data-sets.store';
import { SchedulesApi } from '@api/service/schedules-api';
import { SchedulesStore } from './+schedules/schedules.store';

export const routes: Routes = [
  {
    path: 'schedules',
    data: {
      breadcrumbKey: 'schedules.breadcrumbKey',
    },
    providers: [SchedulesApi, PipelineApi, SchedulesStore, PipelinesStore],
    loadChildren: () => import('./+schedules/schedules.routes').then((m) => m.routes),
  },
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
