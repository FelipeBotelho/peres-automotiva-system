import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Estoque } from '../../estoque/models/estoque';
import { Produto } from '../../produto/models/produto';
import { EstoqueService } from '../services/estoque.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css'],
})
export class DetalhesComponent {
  produto: Produto = new Produto();
  estoque: Estoque = new Estoque();


  constructor(
    private route: ActivatedRoute,
    private estoqueService: EstoqueService,
    private toastr: ToastrService
  ) {
    this.produto = this.route.snapshot.data['produto'];
    this.estoque = this.route.snapshot.data['estoque'];
  }
  getFormattedLocation(localizacao: string) {
    const splitted = localizacao.split('');
    return `C-${splitted[0]}${splitted[1]}_P-${splitted[2]}${splitted[3]}_E-${splitted[4]}${splitted[5]}`;
  }

  alterarItemEstoque() {

    this.estoqueService
      .atualizarEstoque(this.estoque.id!, this.estoque)
      .subscribe({
        next: (data: any) => {
          this.toastr.success('Estoque Atualizado com sucesso!');
        },
      });
  }
}
