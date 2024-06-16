import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserModel } from './domain/userEntity';
import { CreateUserDto } from './dto/createUserDto';

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
    return this.userModel.findOne({
      login,
    });
  }

  public async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }
}
