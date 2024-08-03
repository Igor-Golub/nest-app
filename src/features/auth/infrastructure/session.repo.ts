import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { SessionCommandRepo } from './interfaces';
import type { SessionEntity, SessionDBEntity } from '../domain';

@Injectable()
export class SessionRepo implements SessionCommandRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

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

  public async dropTable() {
    await this.dataSource.query(`TRUNCATE "session";`);
  }
}
