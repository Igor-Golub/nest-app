import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'session',
  timestamps: true,
})
export class SessionModel {
  @Prop({
    type: String,
    required: true,
  })
  version: string;

  @Prop({
    type: String,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  deviceId: string;

  @Prop({
    type: String,
    required: true,
  })
  deviceName: string;

  @Prop({
    type: String,
    required: true,
  })
  deviceIp: string;

  @Prop({
    type: Date,
    required: true,
  })
  expirationDate: Date;
}

export const SessionSchema = SchemaFactory.createForClass(SessionModel);
