import { Component } from '@angular/core';
import { Fornecedor } from '../models/fornecedor';

import { ActivatedRoute, Router } from '@angular/router';
import { FornecedorService } from '../services/fornecedor.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-excluir',
  templateUrl: './excluir.component.html',
})
export class ExcluirComponent {
  fornecedor: Fornecedor = new Fornecedor();
  enderecoMap;
  errors: any[] = [];

  constructor(
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.fornecedor = this.route.snapshot.data['fornecedor'];
    this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.google.com/maps/embed/v1/place?q=' +
        this.EnderecoCompleto() +
        '&key=AIzaSyAP0WKpL7uTRHGKWyakgQXbW6FUhrrA5pE'
    );
  }

  public EnderecoCompleto(): string {
    return (
      this.fornecedor.endereco.logradouro +
      ', ' +
      this.fornecedor.endereco.numero +
      ' - ' +
      this.fornecedor.endereco.bairro +
      ', ' +
      this.fornecedor.endereco.cidade +
      ' - ' +
      this.fornecedor.endereco.estado
    );
  }

  excluirEvento() {
    this.fornecedorService.excluirFornecedor(this.fornecedor.id!).subscribe({
      next: (data: any) => {
        this.sucessoExclusao(data);
      },
      error: (error: any) => {
        this.falha(error);
      },
    });
  }

  sucessoExclusao(evento: any) {
    const toast = this.toastr.success(
      'Fornecedor excluido com Sucesso!',
      'Good bye :D',
      {
        timeOut: 500,
      }
    );
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  falha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(', {
      timeOut: 500,
    });
  }
}
