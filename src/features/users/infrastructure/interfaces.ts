import { UserDBEntity, UserEntity } from '../domain/userEntity';
import { ConfirmDBEntity, ConfirmEntity } from '../domain/confirmEntity';

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

export interface IConfirmationRepo {
  create: (createConfirmationDto: ConfirmEntity) => Promise<string>;
  findByField: <key extends keyof ConfirmEntity>(
    field: key,
    value: ConfirmEntity[key],
  ) => Promise<ConfirmDBEntity | null>;
  updateField: <key extends keyof ConfirmEntity>(
    id: string,
    field: key,
    value: ConfirmEntity[key],
  ) => Promise<boolean>;
  dropTable: () => Promise<void>;
}

export interface IConfirmationQueryRepo {
  findById: (id: string) => Promise<ConfirmDBEntity | null>;
  findByField: <key extends keyof ConfirmEntity>(
    field: key,
    value: ConfirmEntity[key],
  ) => Promise<ConfirmDBEntity | null>;
}
