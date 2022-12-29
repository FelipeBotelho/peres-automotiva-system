import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormBaseComponent } from 'src/app/components/base-components/form-base.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-pages-register',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent
  extends FormBaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];
  formSignup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    super();
    this.validationMessages = {
      userName: {
        required: 'Informe o Nome',
      },
      email: {
        required: 'Informe o Email',
      },
      senha: {
        required: 'Informe a Senha',
      },
    };
    super.configurarMensagensValidacaoBase(this.validationMessages);
  }

  ngOnInit(): void {
    this.formSignup = this.fb.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]],
    });
  }
  ngAfterViewInit(): void {
    super.configurarValidacaoFormularioBase(
      this.formInputElements,
      this.formSignup
    );
  }

  signUp() {
    if (this.formSignup.dirty && this.formSignup.valid) {
      const data = Object.assign({}, this.formSignup.value);

      this.authService.SignUp(data.userName, data.email, data.senha);
    } else {
      this.toastr.warning('Informe todos os campos obrigatórios!');
    }
  }
}
