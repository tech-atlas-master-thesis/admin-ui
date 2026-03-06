import { Routes } from '@angular/router';
import { PipelinesStore } from '../+pipelines/pipelines.store';

export const routes: Routes = [
  {
    path: 'pipelines',
    data: {
      breadcrumbKey: 'scraper.pipelines.breadcrumbKey',
    },
    providers: [PipelinesStore],
    loadChildren: () => import('../+pipelines/pipeline.routes').then((m) => m.routes),
  },
];
