import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Participant } from './participant.entity';
import type { Question } from './question.entity';
import { GameStatus } from '../infrastructure/enums';

@Entity()
export class Game extends BaseEntity {
  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.Pending })
  public status: GameStatus;

  @Column({ type: 'date', nullable: true })
  public startedAt: Date | null;

  @Column({ type: 'date', nullable: true })
  public finishedAt: Date | null;

  @OneToMany('Participant', ({ game }: Participant) => game)
  public participants: Participant[];

  @ManyToMany('Question')
  @JoinTable()
  public questions: Question[];
}
