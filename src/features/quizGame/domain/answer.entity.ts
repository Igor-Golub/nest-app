import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Participant } from './participant.entity';
import type { Question } from './question.entity';

@Entity()
export class Answer extends BaseEntity {
  @Column({ type: 'boolean' })
  public isCorrect: boolean;

  @ManyToOne('Participant', ({ answers }: Participant) => answers)
  public participant: Participant;

  @ManyToOne('Question')
  public question: Question;
}
