import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '@app/common/enums';
import { ToNumber } from '../transform/to-number';

export class QueryParams {
  @IsString()
  @IsOptional()
  sortBy: string = '_id';

  @ToNumber(10)
  @IsNumber()
  @IsOptional()
  pageSize: number;

  @ToNumber(1)
  @IsNumber()
  @IsOptional()
  pageNumber: number;

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection: SortDirection = SortDirection.Desc;
}
