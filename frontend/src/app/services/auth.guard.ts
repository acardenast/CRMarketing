import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuth()) return true;
  return router.createUrlTree(['/login']);
};

export const roleGuard = (...roles: string[]): CanActivateFn => () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuth()) return router.createUrlTree(['/login']);
  if (auth.hasRole(...roles)) return true;
  return router.createUrlTree(['/dashboard']);
};
