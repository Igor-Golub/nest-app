import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recovery } from '../domain/recovery.entity';
import type { CreateRecoveryDTO, UpdateRecoveryDTO } from './interfaces';

@Injectable()
export class RecoveryRepo {
  constructor(
    @InjectRepository(Recovery) private repository: Repository<Recovery>,
  ) {}

  public async findById(id: string) {
    return this.repository
      .createQueryBuilder()
      .from(Recovery, 'r')
      .where('r.id = :id', { id })
      .getOne();
  }

  public async findByField<key extends keyof Recovery>(
    field: key,
    value: Recovery[key],
  ) {
    return this.repository
      .createQueryBuilder()
      .from(Recovery, 'r')
      .where(`r.${field} = :value`, { value })
      .getOne();
  }

  public async findByFields<key extends keyof Recovery>(
    fields: key[],
    value: Recovery[key],
  ) {
    const queryBuilder = this.repository.createQueryBuilder('r');

    fields.forEach((field, index) => {
      const paramKey = `value${index}`;
      queryBuilder[!index ? 'where' : 'orWhere'](`r.${field} = :${paramKey}`, {
        [paramKey]: value,
      });
    });

    return queryBuilder.getMany();
  }

  async updateField<key extends keyof UpdateRecoveryDTO>(
    id: string,
    field: key,
    value: UpdateRecoveryDTO[key],
  ) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(Recovery)
      .set({ [field]: value })
      .where('r.id = :id', { id })
      .execute();

    return !!affected;
  }

  public async create(createRecoveryDto: CreateRecoveryDTO) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(Recovery)
      .values(createRecoveryDto)
      .execute();
  }

  public async delete(id: string) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Recovery)
      .where('id = :id', { id })
      .execute();

    return !!affected;
  }
}
