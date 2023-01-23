import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { FormBaseComponent } from '../../../components/base-components/form-base.component';
import { FornecedorService } from '../../fornecedor/services/fornecedor.service';
import { commonSimpleType } from 'src/app/shared/types/common.types';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.css'],
})
export class NovoComponent extends FormBaseComponent implements OnInit {
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
    private fornecedorService: FornecedorService
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
      quantidade: {
        required: 'Informe a quantidade de itens',
      },
    };

    super.configurarMensagensValidacaoBase(this.validationMessages);
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
      quantidade:['',[Validators.required]],
      localizacao:['']
    });
  }

  ngAfterViewInit(): void {
    super.configurarValidacaoFormularioBase(
      this.formInputElements,
      this.produtoForm
    );
  }

  adicionarProduto() {
    if (this.produtoForm.dirty && this.produtoForm.valid) {
      this.produto = Object.assign({}, this.produto, this.produtoForm.value);
      let objToSend: any = {};
      if (this.imageChangedEvent) {
        objToSend = {
          produto: this.produto,
          imagem: this.imageChangedEvent,
          nomeImagem: this.imagemNome,
        };
      } else {
        this.toastr.error('Selecione uma imagem para o produto');
        return;
      }

      this.produtoService.novoProduto(objToSend);
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
        this.cate = "";
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
