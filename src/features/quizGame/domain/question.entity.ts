import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Game } from './game.entity';

@Entity()
export class Question extends BaseEntity {
  @Column()
  public text: string;

  @Column({ type: 'jsonb' })
  public answers: string[];

  @Column({ type: 'boolean' })
  public published: boolean;

  @ManyToMany('Game')
  public games: Game[];
}
