import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutoAppComponent } from './produto.app.component';
import { ListaComponent } from './lista/lista.component';
import { ProdutoGuard } from './services/produto.guard';
import { NovoComponent } from './novo/novo.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { ProdutoResolve } from './services/produto.resolve';
import { EstoqueResolve } from '../estoque/services/estoque.resolve';
import { EditarComponent } from './editar/editar.component';
// import { NovoComponent } from './novo/novo.component';
// import { EditarComponent } from './editar/editar.component';
// import { DetalhesComponent } from './detalhes/detalhes.component';
// import { ExcluirComponent } from './excluir/excluir.component';
// import { ProdutoResolve } from './services/produto.resolve';
// import { ProdutoGuard } from './services/produto.guard';

const produtoRouterConfig: Routes = [
  {
    path: '',
    component: ProdutoAppComponent,
    children: [
      {
        path: 'listar-todos',
        component: ListaComponent,
        data: [{ claim: { nome: 'Admin' } }],
        canActivate: [ProdutoGuard],
      },
      {
        path: 'adicionar-novo',
        component: NovoComponent,
        canActivate: [ProdutoGuard],
        data: [{ claim: { nome: 'Admin' } }],
      },
      {
        path: 'editar/:id',
        component: EditarComponent,
        canActivate: [ProdutoGuard],
        data: [{ claim: { nome: 'Admin' } }],
        resolve: {
          produto: ProdutoResolve,
        },
      },
      {
        path: 'detalhes/:id',
        component: DetalhesComponent,
        data: [{ claim: { nome: 'Admin' } }],
        resolve: {
          produto: ProdutoResolve,
          estoque: EstoqueResolve
        },
      },
      // {
      //   path: 'excluir/:id',
      //   component: ExcluirComponent,
      //   canActivate: [ProdutoGuard],
      //   data: [{ claim: { nome: 'Produto', valor: 'Excluir' } }],
      //   resolve: {
      //     produto: ProdutoResolve,
      //   },
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(produtoRouterConfig)],
  exports: [RouterModule],
})
export class ProdutoRoutingModule {}
