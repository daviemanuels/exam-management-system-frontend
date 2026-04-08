import { PacienteDTO } from "../paciente/PacienteDTO";
import { Servico } from "../servicos/ServicoDTO";

export type CreateExameDTO = {
  tipo: string;
  pacienteId: string;
  servicos: string[];
};

export type UpdateExameDTO = {
  tipo: string;
  pacienteId: string;
  servicos: string[];
};

export type Exame = {
  id: string;
  numero?: string;
  tipo: string;
  paciente: PacienteDTO;
  servicos: {
    servico: Servico;
  }[];
};
