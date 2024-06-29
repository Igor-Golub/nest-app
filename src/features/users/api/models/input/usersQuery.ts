import { IsOptional, IsString } from 'class-validator';
import { QueryParams } from '../../../../../common/decorators/validate';

export class UsersQueryDto extends QueryParams {
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
