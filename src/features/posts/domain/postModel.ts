import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../../../common/enums';

@Schema({
  collection: 'posts',
  timestamps: true,
  versionKey: false,
})
export class PostModel {
  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    required: true,
    type: String,
  })
  shortDescription: string;

  @Prop({
    required: true,
    type: String,
  })
  content: string;

  @Prop({
    required: true,
    type: String,
  })
  blogId: string;

  @Prop({
    required: true,
    type: String,
  })
  blogName: string;

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

export const PostSchema = SchemaFactory.createForClass(PostModel);
