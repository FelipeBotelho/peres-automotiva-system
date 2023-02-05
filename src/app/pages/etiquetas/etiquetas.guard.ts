import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { BaseGuard } from 'src/app/shared/guard/base.guard';

import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class EtiquetasGuard extends BaseGuard implements CanActivate {
  constructor(
    protected override router: Router,
    protected override authService: AuthService
  ) {
    super(router, authService);
  }

  canActivate(routeAc: ActivatedRouteSnapshot) {
    return super.validarClaims(routeAc);
  }
}
