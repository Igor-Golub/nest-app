import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'recovery',
  timestamps: true,
})
export class RecoveryModel {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  code: string;

  @Prop({
    required: true,
  })
  status: string;

  @Prop({
    required: true,
  })
  expirationDate: Date;
}

export const RecoverySchema = SchemaFactory.createForClass(RecoveryModel);
