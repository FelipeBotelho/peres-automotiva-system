import { Component, OnDestroy, OnInit } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from 'src/environments/environment';
import { DEFAULT_DATATABLE_CONFIG } from 'src/app/utils/datatable-helper';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
})
export class ListaComponent implements OnInit, OnDestroy {
  public produtos!: Produto[];
  errorMessage!: string;
  isLoaded: boolean = false;
  dtOptions: DataTables.Settings = DEFAULT_DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private produtoService: ProdutoService,
    private toastr: ToastrService,
    private _router: Router
  ) {
    this.isLoaded = false;
  }
  excluir(idProduto: any) {
    this.dtTrigger.unsubscribe();
    //Remover Estoque e produto
    const remove = this.produtoService.excluirProduto(idProduto);
    this.reloadComponent();
  }

  reloadComponent() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate(['/produtos/listar-todos']);
  }

  ngOnInit(): void {
    this.produtoService.obterTodos().subscribe({
      next: (produtos) => {
        console.log(produtos);
        this.produtos = produtos;
        this.dtTrigger.next('');
      },
      error: (error) => this.errorMessage,
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
