import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { RecoveryCommandRepo } from './interfaces';
import type { RecoveryDBEntity, RecoveryEntity } from '../domain';

@Injectable()
export class RecoveryRepo implements RecoveryCommandRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async create(createRecoveryDto: RecoveryEntity): Promise<string> {
    const { ownerId, status, expirationAt, code } = createRecoveryDto;

    const queryResult = await this.dataSource.query<RecoveryDBEntity[]>(`
        INSERT INTO "recovery"
        ("ownerId", "status", "expirationAt", "code")
        VALUES ('${ownerId}', '${status}', '${expirationAt}', '${code}')
        RETURNING id
    `);

    return queryResult[0].id;
  }

  public async delete(id: string): Promise<boolean> {
    const queryResult = await this.dataSource.query<RecoveryDBEntity[]>(`
        delete from "recovery" as r
        where r."id" = '${id}';
    `);

    return !!queryResult[1];
  }

  public async dropTable() {
    await this.dataSource.query(`TRUNCATE "recovery";`);
  }
}
