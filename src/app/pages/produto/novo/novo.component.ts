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

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService
  ) {
    super();

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      idMarca: {
        required: 'Informe a Marca',
      },
      idFornecedor: {
        required: 'Informe o Fornecedor',
      },
      idCategoria: {
        required: 'Informe a Categoria do Produto',
      },

      valor: {
        required: 'Informe o Valor do Produto',
      },
      ativo: {
        required: 'Informe se o produto está ativo',
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
      idMarca: ['', [Validators.required]],
      idFornecedor: ['', [Validators.required]],
      idCategoria: ['', [Validators.required]],
      imagem: [''],
      valor: ['', [Validators.required]],
      ativo: ['', [Validators.required]],
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

      this.formResult = JSON.stringify(this.produto);

      this.produtoService.novoProduto(this.produto).subscribe({
        next: (sucesso: any = true) => {
          debugger;
          this.processarSucesso(sucesso);
        },
        error: (falha) => {
          this.processarFalha(falha);
        },
      });
    } else {
      this.toastr.warning('Informe todos os campos obrigatórios!');
    }
  }

  processarSucesso(response: any) {
    this.produtoForm.reset();
    this.errors = [];

    this.mudancasNaoSalvas = false;

    let toast = this.toastr.success(
      'Fornecedor cadastrado com sucesso!',
      'Sucesso!',
      {
        timeOut: 1000,
      }
    );
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(', {
      timeOut: 1000,
    });
  }
}
