import { Column, Entity, ManyToOne } from 'typeorm';
import { LikeStatus } from '../../../../common/enums';
import type { PostComment } from './postComment.entity';
import type { User } from '../../../users/domain/user.entity';

@Entity()
export class CommentLike {
  @ManyToOne('User', (user: User) => user.commentsLikes)
  public owner: User;

  @Column()
  public ownerId: string;

  @ManyToOne('PostComment', (postComment: PostComment) => postComment.likes)
  public comment: PostComment;

  @Column()
  public commentId: string;

  @Column({
    type: 'enum',
    enum: LikeStatus,
    default: LikeStatus.None,
  })
  status: LikeStatus;
}
