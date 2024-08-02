export interface UserEntity {
  login: string;
  email: string;
  hash: string;
  isConfirmed: boolean;
}

export type UserDBEntity = UserEntity & { id: string; createdAt: string };
