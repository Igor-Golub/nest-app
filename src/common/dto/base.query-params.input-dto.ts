import { Type } from 'class-transformer';
import { SortDirection } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

class PaginationParams {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export abstract class BaseSortablePaginationParams<SortByField> extends PaginationParams {
  @ApiProperty({
    description: 'Sort direction for results',
    enum: SortDirection,
    enumName: 'SortDirection',
    example: SortDirection.Desc,
    default: SortDirection.Desc,
    required: false,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection: SortDirection.Desc = SortDirection.Desc;

  @ApiProperty({
    description: 'Field to sort results by',
    required: false,
  })
  abstract sortBy: SortByField;
}
