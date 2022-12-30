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

import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { CepConsulta } from '../models/endereco';
import { StringUtils } from 'src/app/utils/string-utils';
import { FormBaseComponent } from '../../../components/base-components/form-base.component';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html',
  styleUrls: ['./novo.component.css'],
})
export class NovoComponent extends FormBaseComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errors: any[] = [];
  fornecedorForm!: FormGroup;
  fornecedor: Fornecedor = new Fornecedor();

  textoDocumento: string = 'CPF/CNPJ (requerido)';
  formResult: string = '';

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService
  ) {
    super();

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
        cpf: 'CPF em formato inválido',
        cnpj: 'CNPJ em formato inválido',
      },
      contato: {
        required: 'Informe um Telefone de Contato',
      },

      logradouro: {
        required: 'Informe o Logradouro',
      },
      numero: {
        required: 'Informe o Número',
      },
      bairro: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP',
        cep: 'CEP em formato inválido',
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      },
    };

    super.configurarMensagensValidacaoBase(this.validationMessages);
  }

  ngOnInit() {
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      contato: ['', [Validators.required]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: [1, [Validators.required]],

      endereco: this.fb.group({
        logradouro: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]],
      }),
    });

    this.fornecedorForm.patchValue({ tipoFornecedor: '1', ativo: true });
  }

  ngAfterViewInit(): void {
    super.configurarValidacaoFormularioBase(
      this.formInputElements,
      this.fornecedorForm
    );
  }

  buscarCep() {
    let cep = this.fornecedorForm.get('endereco.cep')?.value;
    if (cep) {
      cep = StringUtils.somenteNumeros(cep);
      if (cep.length < 8) return;

      this.fornecedorService.consultarCep(cep).subscribe({
        next: (cepRetorno) => {
          this.preencherEnderecoConsulta(cepRetorno);
        },
        error: (erro) => {
          this.toastr.error('Cep Inválido ou Não Encontrado');
        },
      });
    }
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta) {
    this.fornecedorForm.patchValue({
      endereco: {
        logradouro: cepConsulta.logradouro,
        bairro: cepConsulta.bairro,
        cep: cepConsulta.cep,
        cidade: cepConsulta.localidade,
        estado: cepConsulta.uf,
      },
    });
  }

  adicionarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
      this.fornecedor = Object.assign(
        {},
        this.fornecedor,
        this.fornecedorForm.value
      );

      this.formResult = JSON.stringify(this.fornecedor);

      this.fornecedor.endereco.cep = StringUtils.somenteNumeros(
        this.fornecedor.endereco.cep
      );
      this.fornecedor.documento = StringUtils.somenteNumeros(
        this.fornecedor.documento
      );
      // forçando o tipo fornecedor ser serializado como INT

      this.fornecedorService.novoFornecedor(this.fornecedor).subscribe({
        next: (sucesso: any) => {
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
    this.fornecedorForm.reset();
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
