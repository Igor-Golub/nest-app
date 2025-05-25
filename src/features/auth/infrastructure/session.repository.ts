import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../domain/session.entity';

@Injectable()
export class SessionRepository {
  constructor(@InjectRepository(Session) private repository: Repository<Session>) {}

  public async findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  public async findByOwnerId(ownerId: string) {
    return this.repository.findOneBy({ ownerId });
  }

  public async findByDeviceId(deviceId: string) {
    return this.repository.findOneBy({ deviceId });
  }

  public async findByDeviceIdAndOwnerId(deviceId: string, ownerId: string) {
    return this.repository.findOneBy({ deviceId, ownerId });
  }

  public async findByVersion(version: string) {
    return this.repository.findOneBy({ version });
  }

  public async findByField<key extends keyof Session>(field: key, value: Session[key]) {
    return this.repository.createQueryBuilder('s').where(`s.${field} = :value`, { value }).getMany();
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
      .where('id = :id', { id })
      .execute();

    return !!affected;
  }

  public async create(createSessionDto: Base.DTOFromEntity<Session>) {
    return this.repository.createQueryBuilder().insert().into(Session).values(createSessionDto).execute();
  }

  public async delete(id: string) {
    const { affected } = await this.repository.delete(id);

    return !!affected;
  }

  public async deleteByDeviceIdAndOwnerId(deviceId: string, ownerId: string) {
    const { affected } = await this.repository.delete({ deviceId, ownerId });

    return !!affected;
  }

  public async deleteAllSessions(ownerId: string, sessionsIds: string[]) {
    const { affected } = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Session)
      .where('"ownerId" = :ownerId', { ownerId })
      .andWhere('id IN (:...sessionsIds)', { sessionsIds })
      .execute();

    return !!affected;
  }
}
