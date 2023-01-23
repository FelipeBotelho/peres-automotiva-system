import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, defer, from, Observable } from 'rxjs';
import { map, concatMap, catchError, finalize } from 'rxjs/operators';

import { BaseService } from '../../../shared/services/base.service';
import { Produto } from '../models/produto';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { commonSimpleType } from 'src/app/shared/types/common.types';
import { Router } from '@angular/router';

@Injectable()
export class ProdutoService extends BaseService {
  private dbPath = '/produto';
  produtoRef: AngularFirestoreCollection<Produto>;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private toast: ToastrService,
    private storage: AngularFireStorage,
    private router: Router
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

  excluirProduto(id: string, nomeImagem: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.db
      .collection('estoque', (ref) => ref.where('idProduto', '==', id))
      .get()
      .subscribe({
        next: (ss) => {
          const storageRef = this.storage.ref('/uploads');
          storageRef.child(nomeImagem).delete().subscribe();
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
                  this.router.navigate(['/produtos/listar-todos']);
                });
            });
          } else {
            this.produtoRef
              .doc(id)
              .delete()
              .then((delleted) => {
                this.toast.success('Produto removido com sucesso!');
                this.router.navigate(['/produtos/listar-todos']);
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

  novoProduto(produto: any) {
    produto.dataAtualizacao = new Date();
    produto.dataCadastro = new Date();
    produto.produto.imagem = produto.nomeImagem || '';
    const basePath = '/uploads';

    const filePath = `${basePath}/${produto.nomeImagem}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, produto.imagem);

    return uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            produto.produto.imagemNome = produto.produto.imagem;
            produto.produto.imagem = downloadURL;
            const localizacao = produto.produto.localizacao;
            const qtd = produto.produto.quantidade;
            delete produto.produto.quantidade;
            delete produto.produto.localizacao;
            this.db
              .collection('produto')
              .add(produto.produto)
              .then((data) => {
                this.db
                  .collection('/estoque').doc(data.id)
                  .set({
                    idProduto: data.id,
                    localizacao: localizacao,
                    quantidade: qtd,
                  })
                  .then((data) => {
                    console.log(data);
                    let toast = this.toast.success(
                      'produto cadastrado com sucesso!',
                      'Sucesso!',
                      {
                        timeOut: 1000,
                      }
                    );
                    if (toast) {
                      toast.onHidden.subscribe(() => {
                        this.router.navigate(['/produtos/listar-todos']);
                      });
                    }
                  });
              })
              .catch((error) => {
                this.toast.error(error.message);
              });
          });
        })
      )
      .subscribe();
  }

  addCategoria(cat:string){
    return defer(() => from(this.db.collection("/categoria").add({nome: cat})));
  }

  atualizarProduto(id: string, produto: Produto): Observable<any> {
    return defer(() => from(this.db.doc('/produto/' + id).update(produto)));
  }
}
