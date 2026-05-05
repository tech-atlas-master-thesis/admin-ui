import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@shared/auth/auth.service';

export const authorizationGuard: CanActivateFn = (route) => {
  const role = route.data['role'];
  if (!role) {
    return false;
  }
  return inject(AuthService).check(role);
};
