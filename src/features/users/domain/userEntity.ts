import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({
  id: false,
  _id: false,
})
class Confirmation {
  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  isConfirmed: boolean;

  @Prop({
    type: String,
    required: true,
  })
  code: string;

  @Prop({
    type: Date,
    required: true,
  })
  expirationDate: Date;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class UserModel {
  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  login: string;

  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  hash: string;

  @Prop({
    required: true,
    type: Confirmation,
  })
  confirmation: Confirmation;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
