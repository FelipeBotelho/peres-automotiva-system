import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { defer, from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BaseService } from '../../../shared/services/base.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { commonSimpleType } from 'src/app/shared/types/common.types';
import { Estoque } from '../models/estoque';

@Injectable()
export class EstoqueService extends BaseService {
  estoque: Estoque = new Estoque();
  private dbPath = '/estoque';
  estoqueRef!: AngularFirestoreCollection<Estoque>;

  constructor(private http: HttpClient, private db: AngularFirestore) {
    super();
    this.estoqueRef = db.collection(this.dbPath);
  }

  obterTodos(): Observable<Estoque[]> {
    return this.estoqueRef
      .valueChanges({ idField: 'id' })
      .pipe(catchError(super.serviceError));
  }
 
  obterPorId(id: string): Observable<any> {
    return this.db
      .doc('/estoque/' + id)
      .valueChanges({ idField: 'id' })
      .pipe(catchError(super.serviceError));
  }



  // novoFornecedor(fornecedor: Fornecedor): Observable<any> {
  //   return defer(() => from(this.db.collection('fornecedor').add(fornecedor)));
  // }

  // excluirFornecedor(id: string): Observable<any> {
  //   return defer(() => from(this.fornecedorRef.doc(id).delete()));
  // }

  // atualizarFornecedor(id: string, fornecedor: Fornecedor): Observable<any> {
  //   return defer(() =>
  //     from(this.db.doc('/fornecedor/' + id).update(fornecedor))
  //   );
  // }
}
