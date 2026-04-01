export type PacienteDTO = {
  id: string;
  nome: string;
  cpf: string;
  email?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;
  nacionalidade?: string | null;
  sexo: "Masculino" | "Feminino";
  endereco?: string | null;
};
