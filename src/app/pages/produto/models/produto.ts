export class Produto {
  id?: string;
  nome!: string;
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
  imagem?: string;
  valor!: number;
  dataCadastro!: Date;
  dataAtualizacao!: Date;
  ativo!: boolean;
}
