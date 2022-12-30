import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { EditarComponent } from './editar/editar.component';
import { ExcluirComponent } from './excluir/excluir.component';

import { FornecedorAppComponent } from './fornecedor.app.component';
import { ListaComponent } from './listar-fornecedor/lista.component';
import { NovoComponent } from './novo/novo.component';
import { FornececedorGuard } from './services/fornecedor.guard';
import { FornecedorResolve } from './services/fornecedor.resolve';

const fornecedorRouterConfig: Routes = [
  {
    path: '',
    component: FornecedorAppComponent,
    children: [
      {
        path: 'listar-todos',
        component: ListaComponent,
        canActivate: [FornececedorGuard],
      },
      {
        path: 'adicionar-novo',
        component: NovoComponent,
        canDeactivate: [FornececedorGuard],
        canActivate: [FornececedorGuard],
        data: [{ claim: { nome: 'Vendedor' } }],
      },
      {
        path: 'editar/:id',
        component: EditarComponent,
        canActivate: [FornececedorGuard],
        data: [{ claim: { nome: 'Vendedor' } }],
        resolve: {
          fornecedor: FornecedorResolve,
        },
      },
      {
        path: 'detalhes/:id',
        component: DetalhesComponent,
        resolve: {
          fornecedor: FornecedorResolve,
        },
      },
      {
        path: 'excluir/:id',
        component: ExcluirComponent,
        canActivate: [FornececedorGuard],
        data: [{ claim: { nome: 'Vendedor' } }],
        resolve: {
          fornecedor: FornecedorResolve,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fornecedorRouterConfig)],
  exports: [RouterModule],
})
export class FornecedorRoutingModule {}
