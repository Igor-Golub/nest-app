import { Column, Entity } from 'typeorm';
import { LikeStatus } from '../../../../common/enums';
import { BaseEntity } from '../../../../core/entities/baseEntity';

@Entity()
export class PostLike extends BaseEntity {
  @Column()
  public postId: string;

  @Column({
    type: 'enum',
    enum: LikeStatus,
    default: LikeStatus.None,
  })
  public status: LikeStatus;

  @Column()
  public userId: string;

  @Column()
  public userLogin: string;
}
