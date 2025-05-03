import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';

interface CreateUserDto {
  login: string;
  email: string;
  hash: string;
  isConfirmed: boolean;
}

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  public async create(createUserDto: CreateUserDto) {
    const { identifiers } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(createUserDto)
      .execute();

    return { id: identifiers[0]?.id as string };
  }

  async updateField<key extends keyof Base.DTOFromEntity<User>>(
    id: string,
    field: key,
    value: Base.DTOFromEntity<User>[key],
  ) {
    const { affected } = await this.repository.update(id, { [field]: value });

    return !!affected;
  }

  public async delete(id: string) {
    const { affected } = await this.repository.delete({ id });

    return !!affected;
  }

  public async findByFields(
    options: FindOptionsWhere<User> | FindOptionsWhere<User>[],
  ) {
    return this.repository.findOne({
      where: options,
    });
  }

  public confirmUser(id: string) {
    return this.repository.update(id, { isConfirmed: true });
  }

  public findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  public async drop() {
    return this.repository.delete({});
  }
}
