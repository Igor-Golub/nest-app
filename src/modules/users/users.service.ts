import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersRepo } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  public async create(createUserDto: CreateUserDto) {
    const { _id, id, login, email } =
      await this.usersRepo.create(createUserDto);

    const newUser: ViewModels.User = {
      id,
      login,
      email,
      createdAt: _id._id.getTimestamp().toISOString(),
    };

    return newUser;
  }

  public async delete(id: string) {
    const result = await this.usersRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
