import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogDocument, BlogModel } from './domain/blogEntity';
import { PaginationService } from '../../application/pagination.service';
import { ClientSortingService } from '../../application/clientSorting.service';
import { ClientFilterService } from '../../application/filter.service';

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
      .limit(pageSize);

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
    const result = await this.blogModel.findById(id);

    return this.mapToViewModels([result])[0];
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
