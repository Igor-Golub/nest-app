import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/baseEntity';
import type { Post } from '../../posts/domain/post.entity';

@Entity()
export class Blog extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public websiteUrl: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  public isMembership: boolean;

  @OneToMany('Post', (post: Post) => post.blog)
  public posts: Post[];
}
