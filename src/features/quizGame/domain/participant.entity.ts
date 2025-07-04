import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import type { Game } from './game.entity';
import type { Answer } from './answer.entity';
import type { User } from '../../users/domain/user.entity';
import { PlayerResultOfGame } from '../infrastructure/enums';
import { BaseEntity } from '../../../core/entities/baseEntity';

@Entity()
export class Participant extends BaseEntity {
  @Column()
  public gameId: string;

  @Column({ type: 'int', default: 0 })
  public score: number;

  @Column({ type: 'enum', enum: PlayerResultOfGame, default: PlayerResultOfGame.InProgress })
  public resultOfGame: PlayerResultOfGame;

  @ManyToOne('User', ({ participants }: User) => participants)
  public user: User;

  @ManyToOne('Game', ({ participants }: Game) => participants)
  public game: Game;

  @OneToMany('Answer', ({ participant }: Answer) => participant)
  public answers: Answer[];
}
