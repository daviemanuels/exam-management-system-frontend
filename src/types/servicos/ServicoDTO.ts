export type Servico = {
  id: string;
  nome: string;
  status: string;
};

export type CreateServicoDTO = {
  nome: string;
};
export type UpdateServicoDTO = {
  nome: string;
  status: boolean;
};
