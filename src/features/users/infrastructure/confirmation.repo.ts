import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Confirmation } from '../domain/confirm.entity';

@Injectable()
export class ConfirmationRepository {
  constructor(
    @InjectRepository(Confirmation)
    private repository: Repository<Confirmation>,
  ) {}

  public async create(createConfirmationDto: Base.DTOFromEntity<Confirmation>) {
    return this.repository
      .createQueryBuilder()
      .insert()
      .into(Confirmation)
      .values(createConfirmationDto)
      .execute();
  }

  public async findByField<key extends keyof Confirmation>(
    field: key,
    value: Confirmation[key],
  ) {
    return this.repository
      .createQueryBuilder()
      .from(Confirmation, 'c')
      .where(`c.${field} = :value`, { value })
      .getOne();
  }

  public async updateField<key extends keyof Base.DTOFromEntity<Confirmation>>(
    id: string,
    field: key,
    value: Base.DTOFromEntity<Confirmation>[key],
  ) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(Confirmation)
      .set({ [field]: value })
      .where('c.id = :id', { id })
      .execute();

    return !!affected;
  }

  public async drop() {
    return this.repository.delete({});
  }
}
