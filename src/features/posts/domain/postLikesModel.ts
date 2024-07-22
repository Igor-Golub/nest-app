import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../common/enums';

@Schema({
  collection: 'postLikes',
  timestamps: true,
})
export class PostLikesModel {
  @Prop({
    type: String,
    required: true,
  })
  postId: string;

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

  @Prop({
    type: String,
    required: true,
  })
  userLogin: string;
}

export const PostLikesSchema = SchemaFactory.createForClass(PostLikesModel);
