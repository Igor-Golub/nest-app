import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Confirmation, ConfirmationStatuses } from '../domain/confirm.entity';

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

  public async findByCode(code: string) {
    return this.repository.findOne({ where: { code } });
  }

  public async findByOwnerId(ownerId: string) {
    return this.repository.findOne({ where: { ownerId } });
  }

  public async updateConfirmationStatus(
    id: string,
    status: ConfirmationStatuses,
  ) {
    return this.repository.update(id, { status });
  }

  public async updateConfirmationCode(id: string, code: string) {
    return this.repository.update(id, { code });
  }

  public async drop() {
    return this.repository.delete({});
  }
}
