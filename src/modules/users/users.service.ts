import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUserDto';
import { UserModel } from './domain/userEntity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  public async findWithPagination() {
    return this.userModel.find();
  }

  public async crete(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  public async delete(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
