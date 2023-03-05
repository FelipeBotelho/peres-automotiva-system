import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { commonSimpleType } from 'src/app/shared/types/common.types';
import { DEFAULT_DATATABLE_CONFIG } from 'src/app/utils/datatable-helper';
import { FornecedorService } from '../../fornecedor/services/fornecedor.service';
import { Produto } from '../../produto/models/produto';
import { ProdutoService } from '../../produto/services/produto.service';
import { Estoque } from '../models/estoque';
import { EstoqueService } from '../services/estoque.service';

@Component({
  selector: 'app-dashboard-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListaComponent implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private produtoService: ProdutoService,
    private estoqueService: EstoqueService,
    private toastr: ToastrService
  ) {}
  pecas: any = [];
  produtoForm!: FormGroup;
  fornecedores: commonSimpleType[] = [];
  marcas: commonSimpleType[] = [];
  categorias: commonSimpleType[] = [];
  produtos: Produto[] = [];
  estoque: Estoque[] = [];
  imageSelected = '';
  locationItem = null;
  qtdItem = null;
  selectedItem: any = null;
  pesquisaPorPalavra: boolean = false;

  isLoaded: boolean = false;
  dtOptions: DataTables.Settings = DEFAULT_DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.produtoService.obterTodos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
    });
    this.estoqueService.obterTodos().subscribe({
      next: (estoque) => {
        this.estoque = estoque;
      },
    });
    this.fornecedorService.obterTodosSimples().subscribe((dados) => {
      this.fornecedores = dados;
      console.log(dados);
    });
    this.produtoService.obterMarcas().subscribe((dados) => {
      this.marcas = dados;
      console.log(dados);
    });
    this.produtoService.obterCategorias().subscribe((dados) => {
      this.categorias = dados;
      console.log(dados);
    });
    this.produtoForm = this.fb.group({
      nome: [''],
      codigo: [''],
      descricao: [''],
      marca: [''],
      fornecedor: [''],
      categoria: [''],
    });
  }

  abrirModalImagem(imagem: string) {
    this.imageSelected = imagem;
  }

  abrirModalEdit(item: any) {
    this.locationItem = item.estoque.localizacao;
    this.qtdItem = item.estoque.quantidade;
    this.selectedItem = item;
  }

  alterarItemEstoque() {
    this.selectedItem.estoque.localizacao = this.locationItem;
    this.selectedItem.estoque.quantidade = this.qtdItem;
    this.estoqueService
      .atualizarEstoque(this.selectedItem.estoque.id, this.selectedItem.estoque)
      .subscribe({
        next: (data: any) => {
          this.toastr.success('Estoque Atualizado com sucesso!');
        },
      });
  }

  pesquisar() {
    const filtros = this.produtoForm.value;
    const filt = [];
    if (this.pesquisaPorPalavra) {
      if (filtros.descricao != '') {
        const tags = filtros.descricao.split(' ');
        let uppercaseTags = tags.map((element: string) =>
          element.toUpperCase().trim()
        );

        this.produtos.map((prod) => {
          const desciption = prod.descricao?.split(',');
          if (desciption) {
            const uppercaseDescription = desciption.map((element: string) =>
              element.toUpperCase().trim()
            );
            const hasAllElems = uppercaseTags.every((elem: any) =>
              uppercaseDescription.includes(elem)
            );
            if (hasAllElems) {
              filt.push(prod);
            }
          }
        });
      }
    } else {
      let filtradosPorCampos: any = [];
      filtradosPorCampos = JSON.parse(JSON.stringify(this.produtos));

      if (filtros.nome != '' && filtros.nome != null) {
        filtradosPorCampos = filtradosPorCampos.filter((x: any) =>
          x.nome.toLocaleLowerCase().includes(filtros.nome.toLocaleLowerCase())
        );
      }
      if (filtros.codigo != '' && filtros.codigo != null) {
        filtradosPorCampos = filtradosPorCampos.filter((x: any) =>
          x.codigo
            ?.toLocaleLowerCase()
            .includes(filtros.codigo.toLocaleLowerCase())
        );
      }
      if (
        filtros.categoria != null &&
        filtros.categoria != '' &&
        filtros.categoria.nome != ''
      ) {
        filtradosPorCampos = filtradosPorCampos.filter((x: any) =>
          x.categoria.nome
            .toLocaleLowerCase()
            .includes(filtros.categoria.nome.toLocaleLowerCase())
        );
      }
      if (
        filtros.marca != null &&
        filtros.marca != '' &&
        filtros.marca.nome != ''
      ) {
        filtradosPorCampos = filtradosPorCampos.filter((x: any) =>
          x.marca.nome
            .toLocaleLowerCase()
            .includes(filtros.marca.nome.toLocaleLowerCase())
        );
      }
      if (
        filtros.fornecedor != null &&
        filtros.fornecedor != '' &&
        filtros.fornecedor.nome != ''
      ) {
        filtradosPorCampos = filtradosPorCampos.filter((x: any) =>
          x.fornecedor.nome
            .toLocaleLowerCase()
            .includes(filtros.fornecedor.nome.toLocaleLowerCase())
        );
      }

      filt.push(...filtradosPorCampos);
    }

    const filtrados = new Set(filt);
    this.pecas = Array.from(filtrados);
    this.pecas.forEach((p: any) => {
      p.estoque = this.estoque.find((x) => x.id == p.id);
    });
    setTimeout(() => {
      this.dtTrigger.next('');
    }, 500);
    console.log(this.pecas);
  }

  getFormattedLocation(localizacao: string) {
    const splitted = localizacao.split('');
    return `C-${splitted[0]}${splitted[1]}_P-${splitted[2]}${splitted[3]}_E-${splitted[4]}${splitted[5]}`;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
