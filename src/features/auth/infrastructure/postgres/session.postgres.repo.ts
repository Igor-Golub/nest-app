import { Injectable } from '@nestjs/common';
import type { SessionModel } from '../../domain/sessionEntity';
import type { SessionCommandRepo } from '../interfaces';

@Injectable()
export class SessionPostgresRepo implements SessionCommandRepo {
  constructor() {}

  public async createSession(data: SessionModel) {}

  public async findAllUserSessions(userId: string) {}

  public async deleteSessionByDeviceId(
    data: Pick<SessionModel, 'deviceId' | 'userId'>,
  ) {}

  public async deleteAllSessions(userId: string, sessionsIds: string[]) {}

  public async findSession(data: Partial<SessionModel>) {}

  public async updateSession(id: string, data: Partial<SessionModel>) {}
}
