export class Produto {
  id?: string;
  nome!: string;
  codigo?: string;
  descricao?: string;
  marca!: {
    id: string;
    nome: string;
  };
  fornecedor!: {
    id: string;
    nome: string;
  };
  categoria!: {
    id: string;
    nome: string;
  };
  imagem!: string;
  imagemNome!: string;
  valor!: number;
  dataCadastro!: Date;
  dataAtualizacao!: Date;
  ativo!: boolean;
}
