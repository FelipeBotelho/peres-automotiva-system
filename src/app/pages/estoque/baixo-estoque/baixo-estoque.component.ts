import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Subject } from 'rxjs';
import { commonSimpleType } from 'src/app/shared/types/common.types';
import { DEFAULT_DATATABLE_CONFIG } from 'src/app/utils/datatable-helper';
import { Fornecedor } from '../../fornecedor/models/fornecedor';
import { FornecedorService } from '../../fornecedor/services/fornecedor.service';
import { Produto } from '../../produto/models/produto';
import { ProdutoService } from '../../produto/services/produto.service';
import { Estoque } from '../models/estoque';
import { EstoqueService } from '../services/estoque.service';

@Component({
  selector: 'app-baixo-estoque',
  templateUrl: './baixo-estoque.component.html',
  styleUrls: ['./baixo-estoque.component.css'],
})
export class BaixoEstoqueComponent implements OnInit {
  dados: any[] = [];
  imageSelected = '';
  dtOptions: DataTables.Settings = DEFAULT_DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private fornecedorService: FornecedorService,
    private produtoService: ProdutoService,
    private estoqueService: EstoqueService
  ) {}

  ngOnInit(): void {
    combineLatest({
      produtos: this.produtoService.obterTodos(),
      estoque: this.estoqueService.obterTodos(),
      fornecedores: this.fornecedorService.obterTodosSimples(),
    })
      .pipe(
        map((response) => {
          const produtos = <Array<Produto>>response.produtos;
          const estoque: Estoque[] = <Array<Estoque>>response.estoque;
          const fornecedores = <Array<Fornecedor>>response.fornecedores;
          const result: any[] = [];
          estoque.map((est: Estoque) => {
            if (est.quantidade <= est.quantidadeMinima) {
              result.push({
                ...est,
                ...produtos.find((p: Produto) => p.id === est.id),
                forn: fornecedores.find(
                  (f: Fornecedor) =>
                    f.id == produtos.find((y) => y.id == est.id)?.fornecedor.id
                ),
              });
            }
          });

          return result;
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.dados = data;
        console.log('dados', this.dados);
      });
  }
  getFormattedLocation(localizacao: string) {
    const splitted = localizacao.split('');
    return `C-${splitted[0]}${splitted[1]}_P-${splitted[2]}${splitted[3]}_E-${splitted[4]}${splitted[5]}`;
  }
  abrirModalImagem(imagem: string) {
    this.imageSelected = imagem;
  }
}
