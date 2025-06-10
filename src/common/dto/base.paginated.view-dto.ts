import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginatedViewDto<Item> {
  @ApiProperty({
    description: 'Array of items for the current page',
    isArray: true,
  })
  abstract items: Item;

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 45,
    type: Number,
    minimum: 0,
  })
  totalCount: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
    type: Number,
    minimum: 1,
  })
  pagesCount: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
    minimum: 1,
  })
  pageSize: number;

  public static mapToView<Item>(data: {
    items: Item;
    page: number;
    size: number;
    totalCount: number;
  }): PaginatedViewDto<Item> {
    return {
      page: data.page,
      items: data.items,
      totalCount: data.totalCount,
      pageSize: data.size,
      pagesCount: Math.ceil(data.totalCount / data.size),
    };
  }
}
