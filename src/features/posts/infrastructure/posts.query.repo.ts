import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel } from '../domain/postModel';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';

@Injectable()
export class PostsQueryRepo {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Post>,
  ) {}

  public async getById(id: string) {
    return this.postModel.findById(id).lean();
  }

  public async getWithPagination() {
    const { pageNumber, pageSize } = this.paginationService.getPagination();
    const sort = this.sortingService.createSortCondition() as any;
    const filters = this.filterService.getFilters();

    const data = await this.postModel
      .find(filters)
      .sort(sort)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const amountOfItems = await this.postModel.countDocuments(filters);

    return {
      page: pageNumber,
      pageSize,
      items: data,
      totalCount: amountOfItems,
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }
}
