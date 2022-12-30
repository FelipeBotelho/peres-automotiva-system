import { Endereco } from './endereco';

export class Fornecedor {
  id?: string;
  nome!: string;
  documento!: string;
  ativo!: boolean;
  endereco!: Endereco;
  contato!: string;
}
