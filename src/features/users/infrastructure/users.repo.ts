import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { CreateUserDTO, UpdateUserDTO } from './interfaces';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  public async create(createUserDto: CreateUserDTO): Promise<string> {
    const { id } = this.repository.create(createUserDto);

    return id;
  }

  async updateField<key extends keyof UpdateUserDTO>(
    id: string,
    field: key,
    value: UpdateUserDTO[key],
  ): Promise<boolean> {
    const { affected } = await this.repository.update(id, { [field]: value });

    return !!affected;
  }

  public async delete(id: string): Promise<boolean> {
    const { affected } = await this.repository.delete({ id });

    return !!affected;
  }

  public async findByField(
    options: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ) {
    return this.repository.findOne({
      where: options,
    });
  }
}
