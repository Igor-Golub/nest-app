import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class CommentsModel {
  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  userLogin: string;
}

export const CommentsSchema = SchemaFactory.createForClass(CommentsModel);
