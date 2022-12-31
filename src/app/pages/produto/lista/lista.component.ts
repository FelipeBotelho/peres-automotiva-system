import { Component, OnInit } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
})
export class ListaComponent implements OnInit {
  public produtos!: Produto[];
  errorMessage!: string;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.produtoService.obterTodos().subscribe({
      next: (produtos) => {
        console.log(produtos);
        this.produtos = produtos;
      },
      error: (error) => this.errorMessage,
    });
    // this.produtoService.obterPorId('ncFuFJhruomSNJPx4dB1').subscribe({
    //   next: (result) => {
    //     console.log('Unico', result);
    //   },
    // });
  }
}
