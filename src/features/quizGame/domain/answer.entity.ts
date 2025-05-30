import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Participant } from './participant.entity';
import type { Question } from './question.entity';
import { AnswerStatus } from '../infrastructure/enums';

@Entity()
export class Answer extends BaseEntity {
  @Column({ type: 'enum', enum: AnswerStatus, default: AnswerStatus.InCorrect })
  public status: AnswerStatus;

  @ManyToOne('Participant', ({ answers }: Participant) => answers)
  public participant: Participant;

  @ManyToOne('Question')
  public question: Question;
}
