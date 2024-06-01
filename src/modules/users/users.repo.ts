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

  public async create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  public async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
