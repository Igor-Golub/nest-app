import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserCommandRepo } from './interfaces';
import { UserDBEntity, UserEntity } from '../domain/userEntity';

@Injectable()
export class UsersRepo implements UserCommandRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async create(createUserDto: UserEntity): Promise<string> {
    const { login, hash, email, isConfirmed } = createUserDto;

    const queryResult = await this.dataSource.query<UserDBEntity[]>(`
      INSERT INTO "user"
      ("login", "email", "hash", "isConfirmed")
      VALUES ('${login}', '${email}', '${hash}', ${isConfirmed})
      RETURNING id
    `);

    return queryResult[0].id;
  }

  async updateField<key extends keyof UserEntity>(
    id: string,
    field: key,
    value: UserEntity[key],
  ): Promise<boolean> {
    const queryResult = await this.dataSource.query<UserDBEntity[]>(
      `
        update "user" as u
        set "${field}" = '${value}'
        where u."id" = ${id}
    `,
    );

    return !!queryResult[1];
  }

  async updateFields(
    id: string,
    updateDto: Partial<UserEntity>,
  ): Promise<boolean> {
    const prepareSetData = Object.entries(updateDto).reduce<string>(
      (acc, [field, value]) => acc + `${field} = '${value}'`,
      '',
    );

    const queryResult = await this.dataSource.query<UserDBEntity[]>(
      `
        update "user" as u
        set ${prepareSetData}
        where u."id" = ${id}
    `,
    );

    return !!queryResult[1];
  }

  public async delete(id: string): Promise<boolean> {
    const queryResult = await this.dataSource.query<UserDBEntity[]>(`
        delete from "user" as u
        where u."id" = '${id}';
    `);

    return !!queryResult[1];
  }

  public async findByField<key extends keyof UserEntity>(
    field: key,
    value: UserEntity[key],
  ) {
    const queryResult = await this.dataSource.query<UserDBEntity[]>(
      `
        select *
        from "user" as u
        where u."${field}" = '${value}'
    `,
    );

    return queryResult.length ? queryResult[0] : null;
  }

  public async findByFields<key extends keyof UserEntity>(
    fields: key[],
    value: UserEntity[key],
  ): Promise<UserDBEntity | null> {
    const queryResult = await this.dataSource.query<UserDBEntity[]>(
      `
        select *
        from "user" as u
        where ${value} in ${fields.join(', ')}
    `,
    );

    return queryResult.length ? queryResult[0] : null;
  }
}
