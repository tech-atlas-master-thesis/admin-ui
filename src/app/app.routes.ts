import { Routes } from '@angular/router';
import environment from '../environment/environment';
import { API_BASE_URL } from '@api/service/api-base-url.token';
import { PipelineApi } from '@api/service/pipeline-api';
import { ScraperApi } from '@api/service/scraper-api';
import { TransformerApi } from '@api/service/transformer-api';

export const routes: Routes = [
  {
    path: 'scraper',
    data: {
      breadcrumbKey: 'scraper.breadcrumbKey',
    },
    providers: [
      {
        provide: API_BASE_URL,
        useValue: environment.baseUrl + environment.scraperBaseUrl,
      },
      PipelineApi,
      ScraperApi,
    ],
    loadChildren: () => import('./+scraper/scraper.routes').then((m) => m.routes),
  },
  {
    path: 'transformer',
    data: {
      breadcrumbKey: 'transformer.breadcrumbKey',
    },
    providers: [
      {
        provide: API_BASE_URL,
        useValue: environment.baseUrl + environment.transformerBaseUrl,
      },
      PipelineApi,
      TransformerApi,
    ],
    loadChildren: () => import('./+transformer/transformer.routes').then((m) => m.routes),
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
