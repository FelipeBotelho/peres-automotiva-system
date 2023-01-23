import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EstoqueService} from './estoque.service';

@Injectable()
export class EstoqueResolve implements Resolve<any> {
  constructor(private estoqueService: EstoqueService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.estoqueService.obterPorId(route.params['id']);
  }
}
