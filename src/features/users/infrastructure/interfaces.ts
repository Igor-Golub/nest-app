export interface CreateUserDTO {
  login: string;
  hash: string;
  email: string;
  isConfirmed: boolean;
}

export type UpdateUserDTO = Partial<CreateUserDTO>;
