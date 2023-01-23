import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EstoqueRoutingModule } from './estoque.route';

import { TextMaskModule } from 'angular2-text-mask';
import { NgxSpinnerModule } from 'ngx-spinner';

import { NgxMaskModule } from 'ngx-mask';
import { EstoqueAppComponent } from './estoque.app.component';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables/src/angular-datatables.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EstoqueGuard } from './services/estoque.guard';
import { EstoqueResolve } from './services/estoque.resolve';
import { EstoqueService } from './services/estoque.service';

@NgModule({
  declarations: [
    EstoqueAppComponent,
  ],
  imports: [
    CommonModule,
    EstoqueRoutingModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxSpinnerModule,
    NgxMaskModule,
    SweetAlert2Module,
    ToastrModule,
  ],
  providers: [EstoqueGuard, EstoqueResolve, EstoqueService],
})
export class EstoqueModule {}