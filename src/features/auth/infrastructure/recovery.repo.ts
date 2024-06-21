import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecoveryModel } from '../domain/recoveryEntity';
import { add } from 'date-fns';

@Injectable()
export class RecoveryRepo {
  constructor(
    @InjectModel(RecoveryModel.name)
    private readonly recoveryModel: Model<RecoveryModel>,
  ) {}

  public async create(userId, recoveryCode: string) {
    return this.recoveryModel.create({
      userId,
      code: recoveryCode,
      status: 'created',
      expirationDate: add(new Date(), {
        hours: 1,
      }),
    });
  }

  public async getRecoveryByCode(recoveryCode: string) {
    return this.recoveryModel
      .findOne({
        code: recoveryCode,
      })
      .lean();
  }

  public async updateStatus(recoveryId, status: string) {
    return this.recoveryModel.findOneAndUpdate(recoveryId, {
      $set: {
        status,
      },
    });
  }
}
