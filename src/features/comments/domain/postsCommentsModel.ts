import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../common/enums';

@Schema({
  collection: 'comments',
  timestamps: true,
})
export class PostsCommentsModel {
  @Prop({
    type: String,
    required: true,
  })
  postId: string;

  @Prop({
    type: String,
    required: true,
    min: 20,
    max: 300,
  })
  content: string;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  userLogin: string;

  @Prop({
    type: Number,
    default: 0,
  })
  likesCount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  dislikesCount: number;

  @Prop({
    enum: LikeStatus,
    default: LikeStatus.None,
  })
  currentLikeStatus: LikeStatus;
}

export const PostsCommentsSchema =
  SchemaFactory.createForClass(PostsCommentsModel);
