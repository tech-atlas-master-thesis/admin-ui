import { Routes } from '@angular/router';
import { AuthRole } from '@shared/auth/auth-roles';
import { authorizationGuard } from '@shared/auth/authorization.guard';

export const routes: Routes = [
  {
    data: { breadcrumbKey: undefined, role: AuthRole.VIEW },
    path: '',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./pipeline.component').then((m) => m.Pipeline),
  },
];
