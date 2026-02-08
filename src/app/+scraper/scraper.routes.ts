import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pipelines',
    data: {
      breadcrumbKey: 'scraper.pipelines.breadcrumbKey',
    },
    loadChildren: () => import('./+sc-pipelines/sc-pipeline.routes').then((m) => m.routes),
  },
];
