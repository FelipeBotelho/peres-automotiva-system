import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export abstract class BaseGuard {
  constructor(protected router: Router, protected authService: AuthService) {}

  protected validarClaims(routeAc: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/authentication/sign-in/'], {
        queryParams: { returnUrl: this.router.url },
      });
    }

    let role = localStorage.getItem('user-role');

    let claim: any = routeAc.data[0];
    if (claim !== undefined) {
      let claim = routeAc.data[0]['claim'];

      if (claim) {
        if (!role) {
          this.navegarAcessoNegado();
        }
        let userClaims = role == claim.nome;
        if (!userClaims) {
          this.navegarAcessoNegado();
        }
        let valoresClaim = role!;

        if (!valoresClaim.includes(claim.nome)) {
          this.navegarAcessoNegado();
        }
      }
    }
    return true;
  }

  private navegarAcessoNegado() {
    this.router.navigate(['/acesso-negado']);
  }
}
