import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControlName,
  AbstractControl,
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
    private modalService: NgbModal,
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
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
    });

    this.enderecoForm = this.fb.group({
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: '',
    });

    this.preencherForm();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  preencherForm() {
    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      documento: this.fornecedor.documento,
    });

    this.enderecoForm.patchValue({
      id: this.fornecedor.endereco.id,
      logradouro: this.fornecedor.endereco.logradouro,
      numero: this.fornecedor.endereco.numero,
      complemento: this.fornecedor.endereco.complemento,
      bairro: this.fornecedor.endereco.bairro,
      cep: this.fornecedor.endereco.cep,
      cidade: this.fornecedor.endereco.cidade,
      estado: this.fornecedor.endereco.estado,
    });
  }

  ngAfterViewInit() {
    super.configurarValidacaoFormularioBase(
      this.formInputElements,
      this.fornecedorForm
    );
  }

  buscarCep() {
    let cep = this.enderecoForm.get('cep')?.value;
    if (cep) {
      cep = StringUtils.somenteNumeros(cep);
      if (cep.length < 8) return;

      this.fornecedorService.consultarCep(cep).subscribe({
        next: (cepRetorno) => this.preencherEnderecoConsulta(cepRetorno),
        error: (erro) => this.errors.push(erro),
      });
    }
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta) {
    this.enderecoForm.patchValue({
      logradouro: cepConsulta.logradouro,
      bairro: cepConsulta.bairro,
      cep: cepConsulta.cep,
      cidade: cepConsulta.localidade,
      estado: cepConsulta.uf,
    });
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
          next: (sucesso) => {
            this.processarSucesso(true);
          },
          error: (falha) => {
            this.processarFalha(falha);
          },
        });
    }
  }

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {
      const id = this.fornecedor.id!;
      const enderecoObject = Object.assign(
        {},
        this.fornecedor.endereco,
        this.enderecoForm.value
      );
      enderecoObject.cep = StringUtils.somenteNumeros(enderecoObject.cep);
      const fornecedorObject = Object.assign({}, this.fornecedor);
      fornecedorObject.endereco = enderecoObject;
      delete fornecedorObject.id;

      this.fornecedorService
        .atualizarFornecedor(id, fornecedorObject)
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.processarSucesso(false);
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
        toast.onHidden.subscribe(() => {
          this.router.navigate(['/fornecedores/listar-todos']);
        });
      }
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(', {
      timeOut: 500,
    });
  }

  abrirModal(content: any) {
    this.modalService.open(content);
  }
}
