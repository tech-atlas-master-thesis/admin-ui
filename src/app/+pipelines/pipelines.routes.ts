import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { PipelineStore } from './+pipeline/pipeline.store';
import { PipelineStepsStore } from './+pipeline/pipeline-steps.store';
import { inject } from '@angular/core';
import { AuthRole } from '@shared/auth/auth-roles';
import { authorizationGuard } from '@shared/auth/authorization.guard';

export const routes: Routes = [
  {
    data: {
      breadcrumbKey: undefined,
      role: AuthRole.VIEW,
    },
    path: '',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./pipelines.component').then((m) => m.Pipelines),
  },
  {
    data: {
      breadcrumbKey: 'newPipeline.breadcrumbKey',
      role: AuthRole.EDIT,
    },
    path: 'new',
    canActivate: [authorizationGuard],
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
        const id = activatedRoute.paramMap.get('pipelineId') ?? undefined;
        inject(PipelineStore).setPipelineId(id);
      },
    },
    loadChildren: () => import('./+pipeline/pipeline.routes').then((m) => m.routes),
  },
];
