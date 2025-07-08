import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryParams } from '../../../../../../common/decorators/validate';

@ArgsType()
export class BlogsQueryDtoParams {
  @IsUUID()
  @Field(() => String)
  blogId: string;
}

export class BlogsQueryDto extends QueryParams {
  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
