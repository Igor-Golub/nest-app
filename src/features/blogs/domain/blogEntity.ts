import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'blogs',
  timestamps: true,
})
export class BlogModel {
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
    default: false,
  })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(BlogModel);
