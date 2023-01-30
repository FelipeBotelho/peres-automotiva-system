import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutoResolve } from '../produto/services/produto.resolve';
import { DetalhesComponent } from './detalhes/detalhes.component';

import { EstoqueAppComponent } from './estoque.app.component';
import { EstoqueResolve } from './services/estoque.resolve';

const estoqueRouterConfig: Routes = [
  {
    path: '',
    component: EstoqueAppComponent,
    children: [
      //   {
      //     path: 'listar-todos',
      //     component: ListaComponent,
      //     canActivate: [FornececedorGuard],
      //   },
      //   {
      //     path: 'adicionar-novo',
      //     component: NovoComponent,
      //     canDeactivate: [FornececedorGuard],
      //     canActivate: [FornececedorGuard],
      //     data: [{ claim: { nome: 'Vendedor' } }],
      //   },
      //   {
      //     path: 'editar/:id',
      //     component: EditarComponent,
      //     canActivate: [FornececedorGuard],
      //     data: [{ claim: { nome: 'Vendedor' } }],
      //     resolve: {
      //       fornecedor: FornecedorResolve,
      //     },
      //   },
      {
        path: 'detalhes/:id',
        component: DetalhesComponent,
        resolve: {
          produto: ProdutoResolve,
          estoque: EstoqueResolve,
        },
      },
      //   {
      //     path: 'excluir/:id',
      //     component: ExcluirComponent,
      //     canActivate: [FornececedorGuard],
      //     data: [{ claim: { nome: 'Vendedor' } }],
      //     resolve: {
      //       fornecedor: FornecedorResolve,
      //     },
      //   },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estoqueRouterConfig)],
  exports: [RouterModule],
})
export class EstoqueRoutingModule {}
