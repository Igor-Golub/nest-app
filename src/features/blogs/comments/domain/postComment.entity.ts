import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/baseEntity';
import type { Post } from '../../posts/domain/post.entity';
import type { User } from '../../../users/domain/user.entity';
import type { CommentLike } from './commentLike.entity';

@Entity()
export class PostComment extends BaseEntity {
  @ManyToOne('Post', (post: Post) => post.comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public post: Post;

  @Column()
  postId: string;

  @ManyToOne('User', (user: User) => user.postsComments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public author: User;

  @Column()
  public authorId: string;

  @OneToMany('CommentLike', (commentLike: CommentLike) => commentLike.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  public likes: CommentLike[];

  @Column()
  public content: string;
}
