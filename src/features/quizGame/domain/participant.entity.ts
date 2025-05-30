import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Game } from './game.entity';
import type { Answer } from './answer.entity';
import type { User } from '../../users/domain/user.entity';

@Entity()
export class Participant extends BaseEntity {
  @Column()
  public gameId: string;

  @OneToOne('User', ({ participant }: User) => participant)
  @JoinColumn()
  public user: User;

  @ManyToOne('Game', ({ participants }: Game) => participants)
  public game: Game;

  @OneToMany('Answer', ({ participant }: Answer) => participant)
  public answers: Answer[];
}
