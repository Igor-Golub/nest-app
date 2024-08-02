import { Injectable } from '@nestjs/common';
import type { RecoveryCommandRepo } from '../interfaces';

@Injectable()
export class RecoveryPostgresRepo implements RecoveryCommandRepo {
  constructor() {}

  public async create(userId, recoveryCode: string) {}

  public async getRecoveryByCode(recoveryCode: string) {}

  public async updateStatus(recoveryId, status: string) {}
}
