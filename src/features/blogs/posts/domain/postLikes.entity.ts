import { Column, Entity, ManyToOne } from 'typeorm';
import { LikeStatus } from '../../../../common/enums';
import { BaseEntity } from '../../../../core/entities/baseEntity';
import type { Post } from './post.entity';
import type { User } from '../../../users/domain/user.entity';

@Entity()
export class PostLike extends BaseEntity {
  @ManyToOne('Post', (post: Post) => post.likes)
  public post: string;

  @Column()
  public postId: string;

  @ManyToOne('User', (user: User) => user.postsLikes)
  public owner: User;

  @Column()
  public ownerId: string;

  @Column({
    type: 'enum',
    enum: LikeStatus,
    default: LikeStatus.None,
  })
  public status: LikeStatus;
}
