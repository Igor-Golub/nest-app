import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../domain/session.entity';

@Injectable()
export class SessionRepository {
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
      .createQueryBuilder('s')
      .where(`s.${field} = :value`, { value })
      .getMany();
  }

  public async findByFields<key extends keyof Session>(
    fields: key[],
    value: Session[key],
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .from(Session, 's');

    fields.forEach((field, index) => {
      const paramKey = `value${index}`;
      queryBuilder[!index ? 'where' : 'orWhere'](`s.${field} = :${paramKey}`, {
        [paramKey]: value,
      });
    });

    return queryBuilder.getMany();
  }

  async updateField<key extends keyof Base.DTOFromEntity<Session>>(
    id: string,
    field: key,
    value: Base.DTOFromEntity<Session>[key],
  ) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .update(Session)
      .set({ [field]: value })
      .where('s.id = :id', { id })
      .execute();

    return !!affected;
  }

  public async create(createSessionDto: Base.DTOFromEntity<Session>) {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Session)
      .values(createSessionDto)
      .execute();
  }

  public async delete(id: string) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Session)
      .where('id = :id', { id })
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

  public async deleteAllSessions(ownerId: string, sessionsIds: string[]) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Session, 's')
      .where('"ownerId" = :ownerId', { ownerId })
      .andWhere('id IN (:...sessionsIds)', { sessionsIds })
      .execute();

    return !!affected;
  }
}
