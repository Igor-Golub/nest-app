import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Participant } from './participant.entity';
import type { Question } from './question.entity';
import { GameStatus } from '../infrastructure';

@Entity()
export class Game extends BaseEntity {
  @Column({ type: 'enum', default: GameStatus.Pending, enum: GameStatus })
  public status: GameStatus;

  @Column()
  public startedAt: Date;

  @Column()
  public finishedAt: Date;

  @OneToMany('Participant', ({ game }: Participant) => game)
  public participants: Participant[];

  @ManyToMany('Question')
  @JoinTable()
  public questions: Question[];
}
