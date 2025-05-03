import { IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../common/dto/base.query-params.input-dto';

enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class GetQueryDtoParams {
  @IsUUID()
  id: string;
}

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  sortBy = UsersSortBy.CreatedAt;

  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
