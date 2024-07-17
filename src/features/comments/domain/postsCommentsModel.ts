import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const PostsCommentsSchema =
  SchemaFactory.createForClass(PostsCommentsModel);
