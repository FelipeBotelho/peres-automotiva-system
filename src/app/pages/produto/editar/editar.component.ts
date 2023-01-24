import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { FormBaseComponent } from '../../../components/base-components/form-base.component';
import { FornecedorService } from '../../fornecedor/services/fornecedor.service';
import { commonSimpleType } from 'src/app/shared/types/common.types';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarComponent extends FormBaseComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errors: any[] = [];
  produtoForm!: FormGroup;
  produto: Produto = new Produto();
  fornecedores: commonSimpleType[] = [];
  marcas: commonSimpleType[] = [];
  categorias: commonSimpleType[] = [];
  formResult: string = '';

  imageChangedEvent: any = '';
  imagemNome!: string;
  uploadedImage: any = null;
  isAddingCategoria: boolean = false;
  cate: string = '';
  isAddingMarca: boolean = false;
  isAddingFornecedor: boolean = false;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute
  ) {
    super();

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      marca: {
        required: 'Informe a Marca',
      },
      fornecedor: {
        required: 'Informe o Fornecedor',
      },
      categoria: {
        required: 'Informe a Categoria do Produto',
      },

      valor: {
        required: 'Informe o Valor do Produto',
      },
      ativo: {
        required: 'Informe se o produto está ativo',
      },
      imagem: {
        required: 'Selecione uma imagem para o produto',
      },
    };

    super.configurarMensagensValidacaoBase(this.validationMessages);
    this.produto = this.route.snapshot.data['produto'];
    this.uploadedImage = this.produto.imagem;
    this.imagemNome = this.produto.imagemNome;
    this.imageChangedEvent = 'uploaded';
    console.log(this.uploadedImage);
  }

  ngOnInit() {
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
      nome: ['', [Validators.required]],
      codigo: [''],
      descricao: [''],
      marca: ['', [Validators.required]],
      fornecedor: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      imagem: [''],
      valor: ['', [Validators.required]],
      ativo: [true, [Validators.required]],
    });
    debugger;
    this.produtoForm.patchValue({...this.produto, imagem:''});
  }

  ngAfterViewInit(): void {
    super.configurarValidacaoFormularioBase(
      this.formInputElements,
      this.produtoForm
    );
  }

  editarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      const produtoForm = Object.assign(
        {},
        this.produto,
        this.produtoForm.value
      );
      this.produto.ativo = produtoForm.ativo;
      this.produto.categoria = produtoForm.categoria;
      this.produto.marca = produtoForm.marca;
      this.produto.fornecedor = produtoForm.fornecedor;
      this.produto.codigo = produtoForm.codigo;
      this.produto.descricao = produtoForm.descricao;
      this.produto.valor = produtoForm.valor;
      this.produto.nome = produtoForm.nome;

      let objToSend: any = {};
      if (this.imageChangedEvent) {
        if (this.imagemNome == this.produto.imagemNome) {
          objToSend = {
            produto: this.produto,
            imagem: null,
            nomeImagem: null,
          };
        } else {
          objToSend = {
            produto: this.produto,
            imagem: this.imageChangedEvent,
            nomeImagem: this.imagemNome,
            oldImage: this.produto.imagemNome
          };
        }
      } else {
        this.toastr.error('Selecione uma imagem para o produto');
        return;
      }

      this.produtoService.atualizarProduto(this.produto.id!, objToSend);
    } else {
      this.toastr.warning('Informe todos os campos obrigatórios!');
    }
  }

  adicionarCategoria() {
    this.isAddingCategoria = true;
  }

  concluirAddCategoria() {
    this.produtoService.addCategoria(this.cate).subscribe({
      next: (data) => {
        this.toastr.success('Categoria Incluida com Sucesso!');
        this.isAddingCategoria = false;
        this.cate = '';
      },
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event.currentTarget.files[0];
    if (FileReader && this.imageChangedEvent) {
      const fr = new FileReader();
      fr.onload = () => {
        this.uploadedImage = fr.result;
      };
      fr.readAsDataURL(this.imageChangedEvent);
    }
    this.imagemNome = event.currentTarget.files[0].name;
  }
}
