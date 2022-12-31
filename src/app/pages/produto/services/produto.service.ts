import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable } from 'rxjs';
import { map, concatMap, catchError } from 'rxjs/operators';

import { BaseService } from '../../../shared/services/base.service';
import { Produto } from '../models/produto';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Injectable()
export class ProdutoService extends BaseService {
  private dbPath = '/produto';
  produtoRef: AngularFirestoreCollection<Produto>;

  constructor(private http: HttpClient, private db: AngularFirestore) {
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

  obterPorId(id: string): Observable<any> {
    debugger;
    const colProduto = this.db.doc('/produto/' + id);
    const item = colProduto
      .snapshotChanges()
      .pipe(
        map((changes: any) => {
          const data: any = changes.payload.data();
          const idFornecedor = data.idFornecedor;
          return this.db
            .doc('fornecedor/' + idFornecedor)
            .valueChanges()
            .pipe(
              map((colFornecedor: any) => {
                return Object.assign({
                  nomeFornecedor: colFornecedor.nome,
                  ...data,
                });
              })
            );
        }),
        concatMap((feeds: any) => combineLatest(feeds))
      )
      .pipe(map((arr: any) => arr[0]));
    return item;
  }

  // consultarCep(cep: string): Observable<CepConsulta> {
  //   return this.http
  //     .get<CepConsulta>(`https://viacep.com.br/ws/${cep}/json/`)
  //     .pipe(catchError(super.serviceError));
  // }

  // novoFornecedor(fornecedor: Fornecedor): Observable<any> {
  //   return defer(() => from(this.db.collection('fornecedor').add(fornecedor)));
  // }

  // excluirFornecedor(id: string): Observable<any> {
  //   return defer(() => from(this.produtoRef.doc(id).delete()));
  // }

  // atualizarFornecedor(id: string, fornecedor: Fornecedor): Observable<any> {
  //   return defer(() =>
  //     from(this.db.doc('/fornecedor/' + id).update(fornecedor))
  //   );
  // }
}
