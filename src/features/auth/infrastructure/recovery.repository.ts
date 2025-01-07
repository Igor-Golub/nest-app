import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recovery } from '../domain/recovery.entity';

@Injectable()
export class RecoveryRepository {
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
    const queryBuilder = this.repository
      .createQueryBuilder()
      .from(Recovery, 'r');

    fields.forEach((field, index) => {
      const paramKey = `value${index}`;
      queryBuilder[!index ? 'where' : 'orWhere'](`r.${field} = :${paramKey}`, {
        [paramKey]: value,
      });
    });

    return queryBuilder.getMany();
  }

  async updateField<key extends keyof Base.DTOFromEntity<Recovery>>(
    id: string,
    field: key,
    value: Base.DTOFromEntity<Recovery>[key],
  ) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(Recovery)
      .set({ [field]: value })
      .where('r.id = :id', { id })
      .execute();

    return !!affected;
  }

  public async create(createRecoveryDto: Base.DTOFromEntity<Recovery>) {
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
