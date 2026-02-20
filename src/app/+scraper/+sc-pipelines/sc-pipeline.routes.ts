import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ScPipelineStore } from './+sc-pipeline/sc-pipeline.store';
import { ScPipelineStepsStore } from './+sc-pipeline/sc-pipeline-steps.store';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sc-pipelines').then((m) => m.ScPipelines),
  },
  {
    path: 'new',
    loadComponent: () => import('./+sc-new-pipeline/sc-new-pipeline').then((m) => m.ScNewPipeline),
  },
  {
    path: 'pipeline/:pipelineId',
    providers: [ScPipelineStore, ScPipelineStepsStore],
    resolve: {
      _: (activatedRoute: ActivatedRouteSnapshot) => {
        const parsedId = Number.parseInt(activatedRoute.paramMap.get('pipelineId') ?? '');
        const pipelineId = Number.isNaN(parsedId) ? undefined : parsedId;
        inject(ScPipelineStore).setPipelineId(pipelineId);
        inject(ScPipelineStepsStore).setPipelineId(pipelineId);
      },
    },
    loadChildren: () => import('./+sc-pipeline/sc-pipeline.routes').then((m) => m.routes),
  },
];
