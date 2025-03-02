import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ToNumber } from '../transform';
import { SortDirection } from '../../enums';

export class QueryParams {
  @IsString()
  @IsOptional()
  sortBy: string = 'createdAt';

  @ToNumber(10)
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;

  @ToNumber(1)
  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;

  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection: SortDirection = SortDirection.Desc;
}
