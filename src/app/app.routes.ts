import { Routes } from '@angular/router';
import environment from '../environment/environment';
import { API_BASE_URL } from '@api/pipeline-api/pipeline-api.token';
import { PipelineApi } from '@api/pipeline-api/pipeline-api';
import { ScraperApi } from '@api/pipeline-api/scraper-api';

export const routes: Routes = [
  {
    path: 'scraper',
    data: {
      breadcrumbKey: 'scraper.breadcrumbKey',
      navigable: false,
    },
    providers: [
      {
        provide: API_BASE_URL,
        useValue: environment.baseUrl + '/api/scraper',
      },
      PipelineApi,
      ScraperApi,
    ],
    loadChildren: () => import('./+scraper/scraper.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
