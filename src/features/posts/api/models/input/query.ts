import { IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryValidator {
  @Transform((params) => (params.value.trim() ? params : '_id'))
  sortBy: string;

  @IsNumber()
  pageSize: number = 10;

  @IsNumber()
  pageNumber: number = 1;

  @IsString()
  sortDirection: 'asc' | 'desc' = 'desc';
}
