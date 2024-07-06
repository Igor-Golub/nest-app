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
  commentId: string;

  @Prop({
    required: true,
    enum: LikeStatus,
    default: LikeStatus.None,
  })
  status: LikeStatus;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;
}

export const PostsCommentsSchema =
  SchemaFactory.createForClass(PostsCommentsModel);
