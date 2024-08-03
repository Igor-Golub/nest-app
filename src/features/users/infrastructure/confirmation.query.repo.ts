import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfirmDBEntity, ConfirmEntity } from '../domain/confirmEntity';
import { IConfirmationQueryRepo } from './interfaces';

@Injectable()
export class ConfirmationQueryRepo implements IConfirmationQueryRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async findById(id: string): Promise<ConfirmDBEntity | null> {
    return this.dataSource.query(
      `
        select *
        from "confirmation" as c
        where c."id" = ${id}
    `,
    );
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
}
