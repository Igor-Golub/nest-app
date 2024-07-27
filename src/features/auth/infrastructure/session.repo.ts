import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SessionModel } from '../domain/sessionEntity';

@Injectable()
export class SessionRepo {
  constructor(
    @InjectModel(SessionModel.name)
    private readonly sessionModel: Model<SessionModel>,
  ) {}

  public async createSession(data: SessionModel) {
    return this.sessionModel.create(data);
  }

  public async getByUserIdAndTokenKey(userId: string, tokenKey: string) {
    return this.sessionModel.findOne({
      userId,
      tokenKey,
    });
  }

  public async findAllUserSessions(userId: string) {
    return this.sessionModel.find(
      { userId },
      {
        version: true,
        deviceId: true,
        deviceIp: true,
        deviceName: true,
      },
    );
  }
}
