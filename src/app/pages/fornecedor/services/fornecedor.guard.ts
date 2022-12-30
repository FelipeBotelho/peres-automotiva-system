import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  CanDeactivate,
} from '@angular/router';
import { BaseGuard } from '../../../shared/guard/base.guard';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NovoComponent } from '../novo/novo.component';

@Injectable()
export class FornececedorGuard extends BaseGuard implements CanActivate {
  constructor(
    protected override router: Router,
    protected override authService: AuthService
  ) {
    super(router, authService);
  }

  canDeactivate(component: NovoComponent) {
    if (component.mudancasNaoSalvas) {
      return window.confirm(
        'Tem certeza que deseja abandonar o preenchimento do formulario?'
      );
    }
    return true;
  }

  canActivate(routeAc: ActivatedRouteSnapshot) {
    return super.validarClaims(routeAc);
  }
}
