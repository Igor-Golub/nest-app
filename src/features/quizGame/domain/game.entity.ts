import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Participant } from './participant.entity';
import type { Question } from './question.entity';
import { GameStatus } from '../infrastructure/enums';

@Entity()
export class Game extends BaseEntity {
  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.Pending })
  public status: GameStatus;

  @Column()
  public startedAt: Date;

  @Column({ nullable: true })
  public finishedAt: Date | null;

  @OneToMany('Participant', ({ game }: Participant) => game)
  public participants: Participant[];

  @ManyToMany('Question')
  @JoinTable()
  public questions: Question[];
}
