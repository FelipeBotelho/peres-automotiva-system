import { Produto } from './models/produto';
import { FormGroup } from '@angular/forms';
import { ElementRef } from '@angular/core';

import { FormBaseComponent } from '../../components/base-components/form-base.component';
import { Fornecedor } from '../fornecedor/models/fornecedor';

export abstract class ProdutoBaseComponent extends FormBaseComponent {
  produto!: Produto;
  fornecedores!: Fornecedor[];
  errors: any[] = [];
  produtoForm!: FormGroup;

  constructor() {
    super();

    this.validationMessages = {
      fornecedorId: {
        required: 'Escolha um fornecedor',
      },
      nome: {
        required: 'Informe o Nome',
        minlength: 'Mínimo de 2 caracteres',
        maxlength: 'Máximo de 200 caracteres',
      },
      descricao: {
        required: 'Informe a Descrição',
        minlength: 'Mínimo de 2 caracteres',
        maxlength: 'Máximo de 1000 caracteres',
      },
      imagem: {
        required: 'Informe a Imagem',
      },
      valor: {
        required: 'Informe o Valor',
      },
    };

    super.configurarMensagensValidacaoBase(this.validationMessages);
  }

  protected configurarValidacaoFormulario(formInputElements: ElementRef[]) {
    super.configurarValidacaoFormularioBase(
      formInputElements,
      this.produtoForm
    );
  }
}
