import { IsOptional, IsString, IsUUID } from 'class-validator';
import { QueryParams } from '../../../../../../common/decorators/validate';

export class BlogsQueryDtoParams {
  @IsUUID()
  blogId: string;
}

export class BlogsQueryDto extends QueryParams {
  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
