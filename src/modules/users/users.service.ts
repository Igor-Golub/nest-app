import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersRepo } from './users.repo';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  public async crete(createUserDto: CreateUserDto) {
    const { id, login, email, createdAt } =
      await this.usersRepo.create(createUserDto);

    const newUser: ViewModels.User = {
      id,
      createdAt,
      login,
      email,
    };

    return newUser;
  }

  public async delete(id: string) {
    const result = await this.usersRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
