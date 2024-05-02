import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
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
