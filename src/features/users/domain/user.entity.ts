import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/baseEntity';
import type { Confirmation } from './confirm.entity';
import type { Account } from './account.entity';
import type { Recovery } from '../../auth/domain/recovery.entity';
import type { Session } from '../../auth/domain/session.entity';
import type { Post } from '../../blogs/posts/domain/post.entity';
import type { PostComment } from '../../blogs/comments/domain/postComment.entity';
import type { PostLike } from '../../blogs/posts/domain/postLikes.entity';
import type { CommentLike } from '../../blogs/comments/domain/commentLike.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  public login: string;

  @Column()
  public email: string;

  @Column()
  public hash: string;

  @Column({
    default: false,
  })
  public isConfirmed: boolean;

  @OneToOne('Confirmation', (confirmation: Confirmation) => confirmation.owner)
  public confirmation: Confirmation;

  @OneToOne('Account', (account: Account) => account.owner)
  public account: Account;

  @OneToOne('Recovery', (recovery: Recovery) => recovery.owner)
  public recovery: Recovery;

  @OneToMany('Session', (session: Session) => session.owner)
  public sessions: Session[];

  @OneToMany('Post', (post: Post) => post.author)
  public posts: Post[];

  @OneToMany('PostLike', (postLike: PostLike) => postLike.owner)
  public postsLikes: PostLike[];

  @OneToMany('PostComment', (postComment: PostComment) => postComment.author)
  public postsComments: PostComment[];

  @OneToMany('CommentLike', (commentLike: CommentLike) => commentLike.owner)
  public commentsLikes: CommentLike[];
}
