import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type BlogDocument = HydratedDocument<BlogModel>;

@Schema({
  collection: 'blogs',
  timestamps: true,
})
export class BlogModel {
  _id: ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  websiteUrl: string;

  @Prop({
    required: true,
    default: true,
  })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);
