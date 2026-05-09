import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthRole } from '@shared/auth/auth-roles';
import { authorizationGuard } from '@shared/auth/authorization.guard';
import { ConfigurationStore } from './+configuration-versions/configuration.store';
import { ConfigurationVersionsStore } from './+configuration-versions/configuration-versions.store';

export const routes: Routes = [
  {
    data: {
      breadcrumbKey: undefined,
      role: AuthRole.VIEW,
    },
    path: '',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./configurations.component').then((m) => m.Configurations),
  },
  {
    data: {
      breadcrumbKey: 'newConfiguration.breadcrumbKey',
      role: AuthRole.EDIT,
    },
    path: 'new',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./+create-configuration/create-configuration').then((m) => m.CreateConfiguration),
  },
  {
    path: 'configuration/:configurationId',
    providers: [ConfigurationStore, ConfigurationVersionsStore],
    data: {
      breadcrumbKey: 'configuration.breadcrumbKey',
    },
    resolve: {
      _: (activatedRoute: ActivatedRouteSnapshot) => {
        const id = activatedRoute.paramMap.get('configurationId') ?? undefined;
        inject(ConfigurationStore).setConfigurationId(id);
      },
    },
    loadChildren: () => import('./+configuration-versions/configuration-versions.routes').then((m) => m.routes),
  },
];
