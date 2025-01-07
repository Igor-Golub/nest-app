import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../domain/session.entity';
import type { CreateSessionDTO, UpdateSessionDTO } from './interfaces';

@Injectable()
export class SessionRepo {
  constructor(
    @InjectRepository(Session) private repository: Repository<Session>,
  ) {}

  public async findById(id: string) {
    return this.repository
      .createQueryBuilder()
      .from(Session, 's')
      .where('s.id = :id', { id })
      .getOne();
  }

  public async findByField<key extends keyof Session>(
    field: key,
    value: Session[key],
  ) {
    return this.repository
      .createQueryBuilder()
      .from(Session, 's')
      .where(`s.${field} = :value`, { value })
      .getOne();
  }

  public async findByFields<key extends keyof Session>(
    fields: key[],
    value: Session[key],
  ) {
    const queryBuilder = this.repository.createQueryBuilder('r');

    fields.forEach((field, index) => {
      const paramKey = `value${index}`;
      queryBuilder[!index ? 'where' : 'orWhere'](`s.${field} = :${paramKey}`, {
        [paramKey]: value,
      });
    });

    return queryBuilder.getMany();
  }

  async updateField<key extends keyof UpdateSessionDTO>(
    id: string,
    field: key,
    value: UpdateSessionDTO[key],
  ) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(Session)
      .set({ [field]: value })
      .where('s.id = :id', { id })
      .execute();

    return !!affected;
  }

  public async create(createSessionDto: CreateSessionDTO) {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Session)
      .values(createSessionDto)
      .execute();
  }

  public async delete(id: string): Promise<boolean> {
    const { affected } = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Session, 's')
      .where('s.id = :id', { id })
      .execute();

    return !!affected;
  }

  public async deleteByFields(conditions: Record<string, any>) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .delete()
      .from(Session, 's');

    Object.entries(conditions).forEach(([field, value], index) => {
      queryBuilder[!index ? 'where' : 'andWhere'](`"${field}" = :${field}`, {
        [field]: value,
      });
    });

    const { affected } = await queryBuilder.execute();

    return !!affected;
  }

  public async deleteAllSessions(userId: string, sessionsIds: string[]) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Session, 's')
      .where('"user_id" = :userId', { userId })
      .andWhere('id IN (:...sessionsIds)', { sessionsIds })
      .execute();

    return !!affected;
  }
}
