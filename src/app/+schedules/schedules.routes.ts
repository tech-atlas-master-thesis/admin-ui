import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { AuthRole } from '@shared/auth/auth-roles';
import { authorizationGuard } from '@shared/auth/authorization.guard';
import { inject } from '@angular/core';
import { ScheduleStore } from './+schedule/schedule.store';

export const routes: Routes = [
  {
    data: {
      breadcrumbKey: undefined,
      role: AuthRole.VIEW,
    },
    path: '',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./schedules.component').then((m) => m.SchedulesComponent),
  },
  {
    data: {
      breadcrumbKey: 'newSchedule.breadcrumbKey',
      role: AuthRole.EDIT,
    },
    path: 'new',
    canActivate: [authorizationGuard],
    loadComponent: () => import('./+new-schedule/new-schedule.component').then((m) => m.NewScheduleComponent),
  },
  {
    path: 'schedule/:scheduleId',
    providers: [ScheduleStore],
    data: {
      breadcrumbKey: 'schedule.breadcrumbKey',
    },
    resolve: {
      _: (activatedRoute: ActivatedRouteSnapshot) => {
        const id = activatedRoute.paramMap.get('scheduleId') ?? undefined;
        inject(ScheduleStore).setScheduleId(id);
      },
    },
    loadChildren: () => import('./+schedule/schedule.routes').then((m) => m.routes),
  },
];
