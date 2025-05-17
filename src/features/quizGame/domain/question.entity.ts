import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';

@Entity()
export class Question extends BaseEntity {
  @Column()
  public text: string;

  @Column({ type: 'jsonb' })
  public answers: JSON;

  @Column({ type: 'boolean' })
  public published: boolean;

  @Column({ type: 'uuid', nullable: false })
  public createdBy: string;
}
