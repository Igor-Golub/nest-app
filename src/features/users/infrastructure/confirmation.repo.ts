import { Injectable } from '@nestjs/common';
import { ConfirmDBEntity, ConfirmEntity } from '../domain/confirm.entity';
import { UserDBEntity } from '../domain/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IConfirmationRepo } from './interfaces';

@Injectable()
export class ConfirmationRepo implements IConfirmationRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async create(createConfirmationDto: ConfirmEntity): Promise<string> {
    const { ownerId, status, type, code, expirationAt } = createConfirmationDto;

    const queryResult = await this.dataSource.query<UserDBEntity[]>(`
      INSERT INTO "confirmation"
      ("code", "status", "ownerId", "type", "expirationAt")
      VALUES ('${code}', '${status}', '${ownerId}', '${type}', '${expirationAt}')
      RETURNING id
    `);

    return queryResult[0].id;
  }

  public async findByField<key extends keyof ConfirmEntity>(
    field: key,
    value: ConfirmEntity[key],
  ): Promise<ConfirmDBEntity | null> {
    const queryResult = await this.dataSource.query<ConfirmDBEntity[]>(
      `
        select *
        from "confirmation" as c
        where c."${field}" = '${value}'
    `,
    );

    return queryResult.length ? queryResult[0] : null;
  }

  public async updateField<key extends keyof ConfirmEntity>(
    id: string,
    field: key,
    value: ConfirmEntity[key],
  ): Promise<boolean> {
    const queryResult = await this.dataSource.query<UserDBEntity[]>(
      `
        update "confirmation" as c
        set "${field}" = '${value}'
        where c."id" = ${id}
    `,
    );

    return !!queryResult[1];
  }

  public async dropTable() {
    await this.dataSource.query(`TRUNCATE "confirmation";`);
  }
}
