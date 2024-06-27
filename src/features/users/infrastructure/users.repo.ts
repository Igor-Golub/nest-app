import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel } from '../domain/userEntity';
import { add } from 'date-fns';

@Injectable()
export class UsersRepo {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async create(createUserDto: DBModels.User) {
    return this.userModel.create(createUserDto);
  }

  public async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  public async findByLogin(login: string) {
    return this.userModel
      .findOne({
        login: login,
      })
      .lean();
  }

  public async findByEmail(email: string) {
    return this.userModel
      .findOne({
        email: email,
      })
      .lean();
  }

  public async findByLoginOrEmail(emailOrLogin: string) {
    return this.userModel
      .findOne({
        $or: [{ email: emailOrLogin }, { login: emailOrLogin }],
      })
      .lean();
  }

  public async findByConfirmationCode(code: string) {
    return this.userModel
      .findOne({
        'confirmation.code': code,
      })
      .lean();
  }

  public async confirm(usertId) {
    return this.userModel.findByIdAndUpdate(
      {
        _id: usertId,
      },
      {
        $set: {
          'confirmation.isConfirmed': true,
        },
      },
    );
  }

  public async updateHash(usertId, hash: string) {
    return this.userModel.findByIdAndUpdate(usertId, {
      $set: {
        hash: hash,
      },
    });
  }

  public async updateConfirmationCode(userId, code: string) {
    return this.userModel.findOneAndUpdate(userId, {
      $set: {
        'confirmation.expirationDate': add(new Date(), {
          hours: 1,
        }),
        'confirmation.code': code,
      },
    });
  }
}
