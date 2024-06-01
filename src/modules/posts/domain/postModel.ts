import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<PostModel> & { createdAt: string };

@Schema({
  collection: 'posts',
  timestamps: true,
})
export class PostModel {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  shortDescription: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  blogId: string;

  @Prop({
    required: true,
  })
  blogName: string;
}

export const PostSchema = SchemaFactory.createForClass(PostModel);
