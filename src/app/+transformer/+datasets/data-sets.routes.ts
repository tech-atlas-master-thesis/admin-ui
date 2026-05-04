import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { DataSetStore } from './+data-set/data-set.store';
import { DataSetObjectStore } from './+data-set/data-set-object.store';

export const routes: Routes = [
  {
    data: {
      breadcrumbKey: undefined,
    },
    path: '',
    loadComponent: () => import('./data-sets.component').then((m) => m.DataSetsComponent),
  },
  {
    path: 'dataset/:dataSetId',
    providers: [DataSetStore, DataSetObjectStore],
    data: {
      breadcrumbKey: 'dataSet.breadcrumbKey',
    },
    resolve: {
      _: (activatedRoute: ActivatedRouteSnapshot) => {
        const id = activatedRoute.paramMap.get('dataSetId') ?? undefined;
        inject(DataSetStore).setDataSetId(id);
      },
    },
    loadChildren: () => import('./+data-set/data-set.routes').then((m) => m.routes),
  },
];
