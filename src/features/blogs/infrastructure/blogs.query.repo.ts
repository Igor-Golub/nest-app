import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../domain/blogEntity';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';

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
      page: pageNumber,
      pageSize,
      totalCount: amountOfItems,
      items: this.mapToViewModels(data),
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }

  public async getById(id: string) {
    const blog = await this.blogModel.findById(id);

    if (!blog) throw new NotFoundException();

    return this.mapToViewModels([blog])[0];
  }

  private mapToViewModels(
    data: DBModels.MongoResponseEntity<DBModels.Blog>[],
  ): ViewModels.Blog[] {
    return data.map(({ _id, name, isMembership, websiteUrl, description }) => ({
      id: _id.toString(),
      createdAt: _id.getTimestamp().toISOString(),
      name,
      isMembership,
      websiteUrl,
      description,
    }));
  }
}
