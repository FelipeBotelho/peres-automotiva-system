import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
} from '@angular/router';

// import { NovoComponent } from '../novo/novo.component';
import { BaseGuard } from '../../../shared/guard/base.guard';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NovoComponent } from '../novo/novo.component';

@Injectable() //, CanDeactivate<NovoComponent>
export class ProdutoGuard extends BaseGuard implements CanActivate {
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
