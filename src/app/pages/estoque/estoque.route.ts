import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstoqueAppComponent } from './estoque.app.component';

const estoqueRouterConfig: Routes = [
  {
    path: '',
    component: EstoqueAppComponent,
    // children: [
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
    //   {
    //     path: 'detalhes/:id',
    //     component: DetalhesComponent,
    //     resolve: {
    //       fornecedor: FornecedorResolve,
    //     },
    //   },
    //   {
    //     path: 'excluir/:id',
    //     component: ExcluirComponent,
    //     canActivate: [FornececedorGuard],
    //     data: [{ claim: { nome: 'Vendedor' } }],
    //     resolve: {
    //       fornecedor: FornecedorResolve,
    //     },
    //   },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estoqueRouterConfig)],
  exports: [RouterModule],
})
export class EstoqueRoutingModule {}
