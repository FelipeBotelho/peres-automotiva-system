import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProdutoService } from './produto.service';

@Injectable()
export class ProdutoResolve implements Resolve<any> {
  constructor(private produtoService: ProdutoService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.produtoService.obterPorId(route.params['id']);
  }
}
