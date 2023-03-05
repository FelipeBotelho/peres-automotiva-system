import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutoResolve } from '../produto/services/produto.resolve';
import { BaixoEstoqueComponent } from './baixo-estoque/baixo-estoque.component';
import { DetalhesComponent } from './detalhes/detalhes.component';

import { EstoqueAppComponent } from './estoque.app.component';
import { ListaComponent } from './listar/listar.component';
import { EstoqueGuard } from './services/estoque.guard';
import { EstoqueResolve } from './services/estoque.resolve';

const estoqueRouterConfig: Routes = [
  {
    path: '',
    component: EstoqueAppComponent,
    children: [
      {
        path: 'consultar-estoque',
        component: ListaComponent,
        canActivate: [EstoqueGuard],
        data: [{ claim: { nome: 'Admin|Vendedor' } }],
        resolve: {
          produto: ProdutoResolve,
          estoque: EstoqueResolve,
        },
      },
      {
        path: 'detalhes/:id',
        component: DetalhesComponent,
        canActivate: [EstoqueGuard],
        data: [{ claim: { nome: 'Admin|Vendedor' } }],
        resolve: {
          produto: ProdutoResolve,
          estoque: EstoqueResolve,
        },
      },
      {
        path: 'baixo-estoque',
        component: BaixoEstoqueComponent,
        canActivate: [EstoqueGuard],
        data: [{ claim: { nome: 'Admin' } }],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estoqueRouterConfig)],
  exports: [RouterModule],
})
export class EstoqueRoutingModule {}
