import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UsersService {
  private readonly users: { id: string }[] = [];

  public async findWithPagination() {
    return [];
  }

  public async crete(createUserDto: CreateUserDto) {
    const newUser = {
      ...createUserDto,
      id: Date.now().toString(),
    };

    this.users.push(newUser);

    return newUser;
  }

  public async delete(id: string) {
    this.users.filter((i) => i.id !== id);

    return true;
  }
}
