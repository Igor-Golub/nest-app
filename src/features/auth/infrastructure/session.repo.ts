import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { SessionCommandRepo } from './interfaces';
import type { SessionEntity, SessionDBEntity } from '../domain';

@Injectable()
export class SessionRepo implements SessionCommandRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  public async findById(id: string): Promise<SessionDBEntity | null> {
    return this.dataSource.query(
      `
        select *
        from "session" as s
        where s."id" = ${id}
    `,
    );
  }

  public async findByField<key extends keyof SessionEntity>(
    field: key,
    value: SessionEntity[key],
  ): Promise<SessionDBEntity[]> {
    const queryResult = await this.dataSource.query<SessionDBEntity[]>(
      `
        select *
        from "session" as s
        where s."${field}" = '${value}'
    `,
    );

    return queryResult.length ? queryResult : [];
  }

  public async findByFields<key extends keyof SessionEntity>(
    fields: key[],
    value: SessionEntity[key],
  ): Promise<SessionDBEntity[] | null> {
    const queryResult = await this.dataSource.query<SessionDBEntity[]>(
      `
        select *
        from "session" as s
        where ${value} in ${fields.join(', ')}
    `,
    );

    return queryResult.length ? queryResult : null;
  }

  async updateField<key extends keyof SessionEntity>(
    id: string,
    field: key,
    value: SessionEntity[key],
  ): Promise<boolean> {
    const queryResult = await this.dataSource.query<SessionDBEntity[]>(
      `
        update "session" as s
        set "${field}" = '${value}'
        where s."id" = ${id}
    `,
    );

    return !!queryResult[1];
  }

  public async create(createSessionDto: SessionEntity): Promise<string> {
    const { deviceId, deviceName, deviceIp, version, ownerId } =
      createSessionDto;

    const queryResult = await this.dataSource.query<SessionDBEntity[]>(`
        INSERT INTO "session"
        ("deviceId", "deviceName", "deviceIp", "version", "ownerId",)
        VALUES ('${deviceId}', '${deviceName}', '${deviceIp}', '${version}', '${ownerId}')
        RETURNING id
    `);

    return queryResult[0].id;
  }

  public async delete(id: string): Promise<boolean> {
    const queryResult = await this.dataSource.query<SessionDBEntity[]>(`
        delete from "session" as s
        where s."id" = '${id}';
    `);

    return !!queryResult[1];
  }

  public async deleteByFields(
    conditions: Record<string, any>,
  ): Promise<boolean> {
    const conditionEntries = Object.entries(conditions);

    const whereClauses = conditionEntries.map(
      ([field], index) => `"${field}" = $${index + 1}`,
    );
    const queryParams = conditionEntries.map(([_, value]) => value);

    const queryResult = await this.dataSource.query(
      `
        DELETE FROM "session"
        WHERE ${whereClauses.join(' AND ')};
    `,
      queryParams,
    );

    return !!queryResult[1];
  }

  public async deleteAllSessions(userId: string, sessionsIds: string[]) {
    const queryResult = await this.dataSource.query(`
        delete from "sessions" as s
        where s."user_id" = ${userId} and id in (${sessionsIds});
    `);

    return !!queryResult[1];
  }

  public async dropTable() {
    await this.dataSource.query(`TRUNCATE "session";`);
  }
}
