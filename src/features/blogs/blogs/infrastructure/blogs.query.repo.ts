import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../domain/blogEntity';
import { PaginationService } from '../../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../../infrastructure/services/filter.service';

@Injectable()
export class BlogsQueryRepo {
  constructor(
    @InjectModel(BlogModel.name) private readonly blogModel: Model<BlogModel>,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Blog>,
  ) {}

  public async getWithPagination() {
    const { pageNumber, pageSize } = this.paginationService.getPagination();
    const sort = this.sortingService.createSortCondition() as any;
    const filters = this.filterService.getFilters();

    const data = await this.blogModel
      .find(filters)
      .sort(sort)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const amountOfItems = await this.blogModel.countDocuments(filters);

    return {
      pageSize,
      items: data,
      page: pageNumber,
      totalCount: amountOfItems,
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }

  public async getById(id: string) {
    return this.blogModel.findById(id);
  }
}
