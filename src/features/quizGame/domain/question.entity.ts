import { Column, Entity, ManyToMany } from 'typeorm';
import type { Game } from './game.entity';
import { BaseTrackedEntity } from '../../../core/entities/baseTrackedEntity';

@Entity()
export class Question extends BaseTrackedEntity {
  @Column()
  public text: string;

  @Column({ type: 'jsonb' })
  public answers: string[];

  @Column({ type: 'boolean' })
  public published: boolean;

  @ManyToMany('Game')
  public games: Game[];
}
