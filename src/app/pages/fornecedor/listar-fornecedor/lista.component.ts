import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FornecedorService } from '../services/fornecedor.service';
import { Fornecedor } from '../models/fornecedor';
import { LABELS_DATATABLE } from 'src/app/utils/datatable-helper';
import { MaskApplierService } from 'ngx-mask';
import { ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { Subject } from 'rxjs';

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

  constructor(private fornecedorService: FornecedorService) {
    this.isLoaded = false;
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
