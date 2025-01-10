import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../core/entities/baseEntity';
import type { Blog } from '../../blogs/domain/blog.entity';
import type { User } from '../../../users/domain/user.entity';
import type { PostLike } from './postLikes.entity';
import type { PostComment } from '../../comments/domain/postComment.entity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public shortDescription: string;

  @Column()
  public content: string;

  @Column()
  public blogName: string;

  @ManyToOne('User', (user: User) => user.posts)
  public author: User;

  @Column()
  public authorId: string;

  @ManyToOne('Blog', (blog: Blog) => blog.posts)
  public blog: Blog;

  @Column()
  public blogId: string;

  @OneToMany('PostLike', (postLike: PostLike) => postLike.post)
  public likes: PostLike[];

  @OneToMany('PostComment', (postComment: PostComment) => postComment.post)
  public comments: PostComment[];
}
