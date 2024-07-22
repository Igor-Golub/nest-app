import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../common/enums';

@Schema({
  collection: 'commentsLikes',
  timestamps: true,
})
export class PostCommentLikeModel {
  @Prop({
    type: String,
    required: true,
  })
  parentId: string;

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
  userLogin: string;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;
}

export const PostCommentLikeSchema =
  SchemaFactory.createForClass(PostCommentLikeModel);
