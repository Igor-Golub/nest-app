import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class BlogArgs {
  @Field(() => String)
  @IsUUID()
  id: string;
}

@ObjectType()
export class BlogViewModel {
  @Field()
  id: string;

  @Field()
  createdAt: string;

  @Field()
  name: string;

  @Field()
  websiteUrl: string;

  @Field()
  description: string;

  @Field()
  isMembership: boolean;
}
