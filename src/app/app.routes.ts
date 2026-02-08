import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scraper',
    data: {
      breadcrumbKey: 'scraper.breadcrumbKey',
      navigable: false,
    },
    loadChildren: () => import('./+scraper/scraper.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
