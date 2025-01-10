import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/baseEntity';
import type { User } from '../../../users/domain/user.entity';
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

  @ManyToOne('User', (user: User) => user.blogs)
  public owner: User;

  @Column()
  public ownerId: string;

  @OneToMany('Post', (post: Post) => post.blog)
  public posts: Post[];
}
