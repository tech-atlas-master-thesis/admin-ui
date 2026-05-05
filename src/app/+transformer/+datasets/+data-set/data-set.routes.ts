import { Routes } from '@angular/router';
import { authorizationGuard } from '@shared/auth/authorization.guard';
import { AuthRole } from '@shared/auth/auth-roles';

export const routes: Routes = [
  {
    data: { breadcrumbKey: undefined, role: AuthRole.VIEW },
    path: '',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./data-set.component').then((m) => m.DataSetComponent),
  },
];
