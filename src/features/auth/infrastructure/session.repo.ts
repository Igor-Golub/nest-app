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

  public async isUserSessionExist(userId: string, tokenKey: string) {
    return this.sessionModel.findOne({ userId, tokenKey });
  }

  public async findAllUserSessions(userId: string) {
    return this.sessionModel.find({ userId });
  }

  public async deleteSessionByDeviceId(
    data: Pick<SessionModel, 'deviceId' | 'userId'>,
  ) {
    return this.sessionModel.findOneAndDelete(data);
  }

  public async deleteAllSessions(userId: string, sessionsIds: string[]) {
    return this.sessionModel.deleteMany({
      $and: [{ userId }, { _id: { $in: sessionsIds } }],
    });
  }

  public async findSessionByVersion(version: string) {
    return this.sessionModel.findOne({ version }).lean();
  }

  public async updateSession(id: string, data: Partial<SessionModel>) {
    return this.sessionModel.findByIdAndUpdate(id, data);
  }
}
