import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';
import { LABELS_DATATABLE } from 'src/app/utils/datatable-helper';
import { MaskApplierService } from 'ngx-mask';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent implements OnInit, OnDestroy {
  public fornecedores: Fornecedor[] = [];
  errorMessage!: string;
  isLoaded: boolean = false;
  dtOptions: DataTables.Settings = {
    search: true,
    paging: true,
    responsive: true,
    language: LABELS_DATATABLE,
  };
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private fornecedorService: FornecedorService,
    private toastr: ToastrService,
    private _router: Router
  ) {
    this.isLoaded = false;
  }

  excluir(idFornecedor: any) {
    this.dtTrigger.unsubscribe();
    this.fornecedorService.excluirFornecedor(idFornecedor).subscribe({
      next: (result = true) => {
        this.toastr.success('Fornecedor removido com sucesso!');
        this.reloadComponent();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  reloadComponent() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate(['/fornecedores/listar-todos']);
  }

  ngOnInit(): void {
    this.fornecedorService.obterTodos().subscribe({
      next: (fornecedores: any) => {
        this.fornecedores = fornecedores;
        this.dtTrigger.next('');
      },
      error: (error) => this.errorMessage,
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
