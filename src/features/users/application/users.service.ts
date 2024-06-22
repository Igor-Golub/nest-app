import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepo } from '../infrastructure/users.repo';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepo) {}

  public async create(createUserDto: ServicesModels.CreateUserInput) {}

  public async delete(id: string) {
    const result = await this.usersRepo.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
