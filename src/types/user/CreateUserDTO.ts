export type CreateUserDTO = {
  nome: string;
  login: string;
  senha?: string;
  status?: string;
  funcao_usuario: string;
  roleId: string;
};
