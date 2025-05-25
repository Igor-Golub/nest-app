import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Confirmation } from '../domain/confirm.entity';

@Injectable()
export class ConfirmationQueryRepo {
  constructor(
    @InjectRepository(Confirmation)
    private repository: Repository<Confirmation>,
  ) {}

  public async findById(id: string) {
    return this.repository.createQueryBuilder().from(Confirmation, 'c').where('c.id = :id', { id }).getOne();
  }

  public async findByField<key extends keyof Confirmation>(field: key, value: Confirmation[key]) {
    return this.repository
      .createQueryBuilder()
      .from(Confirmation, 'c')
      .where(`c.${field} = :value`, { value })
      .getMany();
  }
}
