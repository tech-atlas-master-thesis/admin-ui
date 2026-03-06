import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { PipelineStore } from './+pipeline/pipeline.store';
import { PipelineStepsStore } from './+pipeline/pipeline-steps.store';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    data: {
      breadcrumbKey: undefined,
    },
    path: '',
    loadComponent: () => import('./pipelines.component').then((m) => m.Pipelines),
  },
  {
    data: {
      breadcrumbKey: 'newPipeline.breadcrumbKey',
    },
    path: 'new',
    loadComponent: () => import('./+new-pipeline/new-pipeline.component').then((m) => m.NewPipeline),
  },
  {
    path: 'pipeline/:pipelineId',
    providers: [PipelineStore, PipelineStepsStore],
    data: {
      breadcrumbKey: 'pipeline.breadcrumbKey',
    },
    resolve: {
      _: (activatedRoute: ActivatedRouteSnapshot) => {
        const parsedId = Number.parseInt(activatedRoute.paramMap.get('pipelineId') ?? '');
        const pipelineId = Number.isNaN(parsedId) ? undefined : parsedId;
        inject(PipelineStore).setPipelineId(pipelineId);
        inject(PipelineStepsStore).setPipelineId(pipelineId);
      },
    },
    loadChildren: () => import('./+pipeline/pipeline.routes').then((m) => m.routes),
  },
];
