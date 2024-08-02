import { UserDBEntity, UserEntity } from '../domain/userEntity';

export interface UserQueryRepo {
  findWithPagination: () => Promise<UserDBEntity[]>;
  findById: (id: string) => Promise<UserDBEntity | null>;
  findByField: <key extends keyof UserEntity>(
    field: key,
    value: UserEntity[key],
  ) => Promise<UserDBEntity | null>;
  findByFields: <key extends keyof UserEntity>(
    fields: key[],
    value: UserEntity[key],
  ) => Promise<UserDBEntity | null>;
}

export interface UserCommandRepo {
  create: (createUserDto: UserEntity) => Promise<string>;
  updateField: <key extends keyof UserEntity>(
    id: string,
    field: key,
    value: UserEntity[key],
  ) => Promise<boolean>;
  updateFields: (
    id: string,
    updateDto: Partial<UserEntity>,
  ) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
  findByField: <key extends keyof UserEntity>(
    field: key,
    value: UserEntity[key],
  ) => Promise<UserDBEntity | null>;
  findByFields: <key extends keyof UserEntity>(
    fields: key[],
    value: UserEntity[key],
  ) => Promise<UserDBEntity | null>;
  dropTable: () => Promise<void>;
}
