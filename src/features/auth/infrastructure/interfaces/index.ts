import type { SessionModel } from '../../domain/sessionEntity';

export interface SessionCommandRepo {
  createSession: (data: SessionModel) => Promise<any>;
  findAllUserSessions: (userId: string) => Promise<any>;
  deleteSessionByDeviceId: (
    data: Pick<SessionModel, 'deviceId' | 'userId'>,
  ) => Promise<any>;
  deleteAllSessions: (userId: string, sessionsIds: string[]) => Promise<any>;
  findSession: (data: Partial<SessionModel>) => Promise<any>;
  updateSession: (id: string, data: Partial<SessionModel>) => Promise<any>;
}

export interface RecoveryCommandRepo {
  create: (userId, recoveryCode: string) => Promise<any>;
  getRecoveryByCode: (recoveryCode: string) => Promise<any>;
  updateStatus: (recoveryId, status: string) => Promise<any>;
}
