import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, defer, from, Observable } from 'rxjs';
import { map, concatMap, catchError } from 'rxjs/operators';

import { BaseService } from '../../../shared/services/base.service';
import { Produto } from '../models/produto';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { commonSimpleType } from 'src/app/shared/types/common.types';

@Injectable()
export class ProdutoService extends BaseService {
  private dbPath = '/produto';
  produtoRef: AngularFirestoreCollection<Produto>;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private toast: ToastrService
  ) {
    super();
    this.produtoRef = db.collection(this.dbPath);
  }

  obterTodos(): Observable<any> {
    return this.produtoRef
      .valueChanges({ idField: 'id' })
      .pipe(
        map((data) =>
          data.sort((a: any, b: any) => {
            return a.nome.localeCompare(b.nome);
          })
        )
      )
      .pipe(catchError(super.serviceError));
  }

  obterMarcas(): Observable<commonSimpleType[]> {
    return this.db
      .collection('/marca')
      .valueChanges({ idField: 'id' })
      .pipe(
        map((data) => {
          return data.map((dado: any) => {
            return { id: dado.id, nome: dado.nome };
          });
        })
      );
  }

  obterCategorias(): Observable<commonSimpleType[]> {
    return this.db
      .collection('/categoria')
      .valueChanges({ idField: 'id' })
      .pipe(
        map((data) => {
          return data.map((dado: any) => {
            return { id: dado.id, nome: dado.nome };
          });
        })
      );
  }

  excluirProduto(id: string) {
    this.db
      .collection('estoque', (ref) => ref.where('idProduto', '==', id))
      .get()
      .subscribe({
        next: (ss) => {
          if (ss.docs.length !== 0) {
            //deletar estoque e produto
            ss.docs[0].ref.delete().then((deletted) => {
              this.produtoRef
                .doc(id)
                .delete()
                .then((delleted) => {
                  this.toast.success(
                    'Produto removido e estoque zerado com sucesso'
                  );
                });
            });
          } else {
            this.produtoRef
              .doc(id)
              .delete()
              .then((delleted) => {
                this.toast.success('Produto removido com sucesso!');
              });
          }
        },
        error: (err) => {
          this.toast.error(err.message);
        },
      });
  }

  obterPorId(id: string): Observable<any> {
    return this.db
      .doc('/produto/' + id)
      .valueChanges({ idField: 'id' })
      .pipe(catchError(super.serviceError));
  }

  novoProduto(produto: Produto): Observable<any> {
    produto.dataAtualizacao = new Date();
    produto.dataCadastro = new Date();
    return defer(() => from(this.db.collection('produto').add(produto)));
  }

  atualizarProduto(id: string, produto: Produto): Observable<any> {
    return defer(() => from(this.db.doc('/produto/' + id).update(produto)));
  }
}
