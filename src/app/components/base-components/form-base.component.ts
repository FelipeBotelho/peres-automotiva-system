import { ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable, fromEvent, merge } from 'rxjs';

import {
  GenericValidator,
  DisplayMessage,
  ValidationMessages,
} from '../../utils/generic-form-validation';

export abstract class FormBaseComponent {
  displayMessage: DisplayMessage = {};
  genericValidator!: GenericValidator;
  validationMessages!: ValidationMessages;

  mudancasNaoSalvas!: boolean;

  protected configurarMensagensValidacaoBase(
    validationMessages: ValidationMessages
  ) {
    this.genericValidator = new GenericValidator(validationMessages);
  }

  protected configurarValidacaoFormularioBase(
    formInputElements: ElementRef[],
    formGroup: FormGroup
  ) {
    let a = formInputElements.map((formControl) => {
      formControl.nativeElement;
    });
    let controlBlurs: Observable<any>[] = formInputElements.map(
      (formControl: ElementRef) => {
        if (formControl.nativeElement.classList.contains('ng-select')) {
          return fromEvent(
            formControl.nativeElement.children[0].children[0].children[2]
              .children[0],
            'blur'
          );
        }
        return fromEvent(formControl.nativeElement, 'blur');
      }
    );

    merge(...controlBlurs).subscribe(() => {
      this.validarFormulario(formGroup);
    });
  }

  protected validarFormulario(formGroup: FormGroup) {
    this.displayMessage = this.genericValidator.processarMensagens(formGroup);
    this.mudancasNaoSalvas = true;
  }
}
