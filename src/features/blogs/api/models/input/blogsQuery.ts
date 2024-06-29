import { IsOptional, IsString } from 'class-validator';
import { IsStringWithExpectedLength } from '@app/common/decorators';
import { QueryParams } from '@app/common/decorators/validate';

export class BlogsQueryDtoParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}

export class BlogsQueryDto extends QueryParams {
  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
