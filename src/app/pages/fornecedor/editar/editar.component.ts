import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { StringUtils } from 'src/app/utils/string-utils';
import { Fornecedor } from '../models/fornecedor';
import { Endereco, CepConsulta } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';
import { FormBaseComponent } from '../../../components/base-components/form-base.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
})
export class EditarComponent extends FormBaseComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errors: any[] = [];
  errorsEndereco: any[] = [];
  fornecedorForm!: FormGroup;
  enderecoForm!: FormGroup;

  fornecedor: Fornecedor = new Fornecedor();
  endereco: Endereco = new Endereco();

  textoDocumento: string = '';

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private spinner: NgxSpinnerService
  ) {
    super();

    config.backdrop = 'static';
    config.keyboard = false;

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
        cpf: 'CPF em formato inválido',
        cnpj: 'CNPJ em formato inválido',
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

    this.fornecedor = this.route.snapshot.data['fornecedor'];
  }

  ngOnInit() {
    this.spinner.show();

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

    this.preencherForm();
  }

  preencherForm() {
    this.fornecedorForm.patchValue(this.fornecedor);
  }

  ngAfterViewInit() {
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
    if (!cepConsulta.erro) {
      this.fornecedorForm.patchValue({
        endereco: {
          logradouro: cepConsulta.logradouro,
          bairro: cepConsulta.bairro,
          cep: cepConsulta.cep,
          cidade: cepConsulta.localidade,
          estado: cepConsulta.uf,
        },
      });
    } else {
      this.toastr.warning('CEP não encontrado');
    }
  }

  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {
      const id = this.fornecedor.id!;
      const fornecedorObject = Object.assign(
        {},
        this.fornecedor,
        this.fornecedorForm.value
      );
      delete fornecedorObject.id;
      fornecedorObject.documento = StringUtils.somenteNumeros(
        this.fornecedor.documento
      );

      this.fornecedorService
        .atualizarFornecedor(id, fornecedorObject)
        .subscribe({
          next: (sucesso = true) => {
            this.processarSucesso(true);
          },
          error: (falha) => {
            this.processarFalha(falha);
          },
        });
    }
  }

  processarSucesso(fechar: boolean) {
    this.errors = [];

    let toast = this.toastr.success(
      'Fornecedor atualizado com sucesso!',
      'Sucesso!',
      {
        timeOut: 500,
      }
    );
    if (fechar) {
      if (toast) {
        // toast.onHidden.subscribe(() => {
        //   this.router.navigate(['/fornecedores/listar-todos']);
        // });
      }
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(', {
      timeOut: 500,
    });
  }
}
