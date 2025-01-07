import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/baseEntity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public shortDescription: string;

  @Column()
  public content: string;

  @Column()
  public blogId: string;

  @Column()
  public blogName: string;
}
