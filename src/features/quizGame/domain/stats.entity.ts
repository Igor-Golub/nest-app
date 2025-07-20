import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { User } from '../../users/domain/user.entity';

@Entity()
export class GameStats extends BaseEntity {
  @JoinColumn()
  @OneToOne('User', ({ gameStats }: User) => gameStats)
  public user: User;

  @Column({ type: 'int', default: 0 })
  public sumScore: number;

  @Column({ type: 'int', default: 0 })
  public winsCount: number;

  @Column({ type: 'int', default: 0 })
  public drawsCount: number;

  @Column({ type: 'int', default: 0 })
  public lossesCount: number;

  @Column({ type: 'int', default: 0 })
  public gamesCount: number;

  @Column({ type: 'int', default: 0 })
  public avgScores: number;
}
