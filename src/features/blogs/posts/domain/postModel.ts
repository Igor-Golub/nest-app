import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const PostSchema = SchemaFactory.createForClass(PostModel);
