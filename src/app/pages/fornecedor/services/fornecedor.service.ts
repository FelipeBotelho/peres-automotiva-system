import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { defer, from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService } from '../../../shared/services/base.service';
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta, Endereco } from '../models/endereco';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { commonSimpleType } from 'src/app/shared/types/common.types';

@Injectable()
export class FornecedorService extends BaseService {
  fornecedor: Fornecedor = new Fornecedor();
  private dbPath = '/fornecedor';
  fornecedorRef: AngularFirestoreCollection<Fornecedor>;

  constructor(private http: HttpClient, private db: AngularFirestore) {
    super();
    this.fornecedorRef = db.collection(this.dbPath);
  }

  obterTodos(): Observable<Fornecedor[]> {
    return this.fornecedorRef
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
  obterTodosSimples(): Observable<commonSimpleType[]> {
    return this.fornecedorRef.valueChanges({ idField: 'id' }).pipe(
      map((data) => {
        return data.map((dado) => {
          return { id: dado.id, nome: dado.nome };
        });
      })
    );
  }

  obterPorId(id: string): Observable<any> {
    return this.db
      .doc('/fornecedor/' + id)
      .valueChanges({ idField: 'id' })
      .pipe(catchError(super.serviceError));
  }

  consultarCep(cep: string): Observable<CepConsulta> {
    return this.http
      .get<CepConsulta>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(catchError(super.serviceError));
  }

  novoFornecedor(fornecedor: Fornecedor): Observable<any> {
    return defer(() => from(this.db.collection('fornecedor').add(fornecedor)));
  }

  excluirFornecedor(id: string): Observable<any> {
    return defer(() => from(this.fornecedorRef.doc(id).delete()));
  }

  atualizarFornecedor(id: string, fornecedor: Fornecedor): Observable<any> {
    return defer(() =>
      from(this.db.doc('/fornecedor/' + id).update(fornecedor))
    );
  }
}
