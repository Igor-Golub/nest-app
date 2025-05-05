import { Type } from 'class-transformer';
import { SortDirection } from '../enums';

class PaginationParams {
  @Type(() => Number)
  pageNumber: number = 1;

  @Type(() => Number)
  pageSize: number = 10;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}

export abstract class BaseSortablePaginationParams<
  SortByField,
> extends PaginationParams {
  sortDirection: SortDirection.Desc = SortDirection.Desc;
  abstract sortBy: SortByField;
}
