import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<UserModel> & { createdAt: string };

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel {
  @Prop({
    required: true,
  })
  login: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  hash: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
