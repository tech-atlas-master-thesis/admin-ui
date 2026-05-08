import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthRole } from '@shared/auth/auth-roles';
import { authorizationGuard } from '@shared/auth/authorization.guard';
import { ConfigurationVersionStore } from './+configuration-version/configuration-version.store';

export const routes: Routes = [
  {
    data: {
      breadcrumbKey: undefined,
      role: AuthRole.VIEW,
    },
    path: '',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./configuration-versions').then((m) => m.ConfigurationVersions),
  },
  {
    data: {
      breadcrumbKey: 'newConfigurationVersion.breadcrumbKey',
      role: AuthRole.EDIT,
    },
    path: 'new',
    canActivate: [authorizationGuard],
    loadComponent: () =>
      import('./+create-configuration-version/create-configuration-version').then((m) => m.CreateConfigurationVersion),
  },
  {
    path: '/version/:versionId',
    providers: [ConfigurationVersionStore],
    data: {
      breadcrumbKey: 'configurationVersion.breadcrumbKey',
    },
    resolve: {
      _: (activatedRoute: ActivatedRouteSnapshot) => {
        const id = activatedRoute.paramMap.get('versionId') ?? undefined;
        inject(ConfigurationVersionStore).setVersionId(id);
      },
    },
    loadChildren: () => import('./+configuration-version/configuration-version.routes').then((m) => m.routes),
  },
];
