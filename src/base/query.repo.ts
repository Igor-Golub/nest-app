import { PaginationService } from '../infrastructure/services/pagination.service';
import { ClientSortingService } from '../infrastructure/services/clientSorting.service';
import { Injectable } from '@nestjs/common';
import { ClientFilterService } from '../infrastructure/services/filter.service';

@Injectable()
export class BaseQueryRepo<Model> {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<Model>,
  ) {}

  public async getWithPaginationAndSorting(model, mapperToViewModels) {
    const { pageNumber, pageSize } = this.paginationService.getPagination();
    const sort = this.sortingService.createSortCondition() as any;
    const filters = this.filterService.getFilters();

    const data = await model
      .find(filters)
      .sort(sort)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const amountOfItems = await model.countDocuments(filters);

    return {
      page: pageNumber,
      pageSize,
      totalCount: amountOfItems,
      items: mapperToViewModels(data),
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }
}
