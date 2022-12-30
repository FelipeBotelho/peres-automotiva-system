import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FornecedorRoutingModule } from './fornecedor.route';
import { FornecedorService } from './services/fornecedor.service';

import { TextMaskModule } from 'angular2-text-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { FornececedorGuard } from './services/fornecedor.guard';
import { NgxMaskModule } from 'ngx-mask';
import { FornecedorAppComponent } from './fornecedor.app.component';
import { ListaComponent } from './listar-fornecedor/lista.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { FornecedorResolve } from './services/fornecedor.resolve';
import { NovoComponent } from './novo/novo.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditarComponent } from './editar/editar.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { DataTablesModule } from 'angular-datatables/src/angular-datatables.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    FornecedorAppComponent,
    ListaComponent,
    DetalhesComponent,
    NovoComponent,
    EditarComponent,
    ExcluirComponent,
  ],
  imports: [
    CommonModule,
    FornecedorRoutingModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxSpinnerModule,
    NgxMaskModule,
    SweetAlert2Module,
    ToastrModule,
  ],
  providers: [FornecedorService, FornececedorGuard, FornecedorResolve],
})
export class FornecedorModule {}
