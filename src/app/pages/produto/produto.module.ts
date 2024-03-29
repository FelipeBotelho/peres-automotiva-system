import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ProdutoRoutingModule } from './produto.route';
import { ProdutoAppComponent } from './produto.app.component';
// import { ListaComponent } from './lista/lista.component';
// import { NovoComponent } from './novo/novo.component';
// import { EditarComponent } from './editar/editar.component';
// import { ExcluirComponent } from './excluir/excluir.component';
// import { DetalhesComponent } from './detalhes/detalhes.component';
// import { ProdutoService } from './services/produto.service';
// import { ProdutoResolve } from './services/produto.resolve';
// import { ProdutoGuard } from './services/produto.guard';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ListaComponent } from './lista/lista.component';
import { ProdutoService } from './services/produto.service';
import { ProdutoGuard } from './services/produto.guard';
import { NgxMaskModule } from 'ngx-mask';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';
import { NovoComponent } from './novo/novo.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProdutoResolve } from './services/produto.resolve';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { EditarComponent } from './editar/editar.component';

@NgModule({
  declarations: [
    ProdutoAppComponent,
    ListaComponent,
    NovoComponent,
    EditarComponent,
    // ExcluirComponent,
    DetalhesComponent,
  ],
  imports: [
    CommonModule,
    TextMaskModule,
    NgSelectModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgxMaskModule,
    SweetAlert2Module,
    ToastrModule,
    DataTablesModule,
    ImageCropperModule,
    CurrencyMaskModule,
    ProdutoRoutingModule,
  ],
  providers: [ProdutoService, ProdutoGuard, ProdutoResolve],
})
export class ProdutoModule {}
