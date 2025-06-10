import { IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseSortablePaginationParams } from '../../../../../common/dto/base.query-params.input-dto';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    enum: UsersSortBy,
    required: false,
    enumName: 'UsersSortByField',
    example: UsersSortBy.CreatedAt,
    default: UsersSortBy.CreatedAt,
    description: 'Field to sort users by',
  })
  @IsOptional()
  sortBy = UsersSortBy.CreatedAt;

  @ApiProperty({
    description: 'Search term for filtering by login',
    example: 'john',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;

  @ApiProperty({
    description: 'Search term for filtering by email',
    example: 'gmail.com',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
