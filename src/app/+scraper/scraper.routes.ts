import { Routes } from '@angular/router';
import { ScPipelinesStore } from './+sc-pipelines/sc-pipelines.store';

export const routes: Routes = [
  {
    path: 'pipelines',
    data: {
      breadcrumbKey: 'scraper.pipelines.breadcrumbKey',
    },
    providers: [ScPipelinesStore],
    loadChildren: () => import('./+sc-pipelines/sc-pipeline.routes').then((m) => m.routes),
  },
];
