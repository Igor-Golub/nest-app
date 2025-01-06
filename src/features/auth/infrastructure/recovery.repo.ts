import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recovery } from '../domain/recovery.entity';

@Injectable()
export class RecoveryRepo {
  constructor(
    @InjectRepository(Recovery) private repository: Repository<Recovery>,
  ) {}

  public async findById(id: string): Promise<RecoveryDBEntity | null> {
    return this.dataSource.query(
      `
        select *
        from "recovery" as r
        where r."id" = ${id}
    `,
    );
  }

  public async findByField<key extends keyof RecoveryEntity>(
    field: key,
    value: RecoveryEntity[key],
  ): Promise<RecoveryDBEntity | null> {
    const queryResult = await this.dataSource.query<RecoveryDBEntity[]>(
      `
        select *
        from "recovery" as r
        where r."${field}" = '${value}'
    `,
    );

    return queryResult.length ? queryResult[0] : null;
  }

  public async findByFields<key extends keyof RecoveryEntity>(
    fields: key[],
    value: RecoveryEntity[key],
  ): Promise<RecoveryDBEntity | null> {
    const queryResult = await this.dataSource.query<RecoveryDBEntity[]>(
      `
        select *
        from "recovery" as r
        where ${value} in ${fields.join(', ')}
    `,
    );

    return queryResult.length ? queryResult[0] : null;
  }

  async updateField<key extends keyof RecoveryEntity>(
    id: string,
    field: key,
    value: RecoveryEntity[key],
  ): Promise<boolean> {
    const queryResult = await this.dataSource.query<RecoveryDBEntity[]>(
      `
        update "recovery" as r
        set "${field}" = '${value}'
        where r."id" = ${id}
    `,
    );

    return !!queryResult[1];
  }

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
