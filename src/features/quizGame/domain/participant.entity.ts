import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Game } from './game.entity';
import type { Answer } from './answer.entity';

@Entity()
export class Participant extends BaseEntity {
  @Column()
  public gameId: string;

  @ManyToOne('Game', ({ participants }: Game) => participants)
  public game: Game;

  @OneToMany('Answer', ({ participant }: Answer) => participant)
  public answers: Answer[];
}
