import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsCommentsModel } from '../domain/postsCommentsModel';
import { Model } from 'mongoose';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectModel(PostsCommentsModel.name)
    private readonly postsCommentsModel: Model<PostsCommentsModel>,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Comment>,
  ) {}

  public async getById(id: string) {
    return this.postsCommentsModel.findById(id).lean();
  }

  public async isCommentExist(id: string) {
    const amount = await this.postsCommentsModel.countDocuments({ _id: id });

    return amount > 0;
  }

  public async isOwnerComment(id: string, ownerId: string) {
    return this.postsCommentsModel.countDocuments({ _id: id, userId: ownerId });
  }

  public async getWithPagination() {
    const { pageNumber, pageSize } = this.paginationService.getPagination();
    const sort = this.sortingService.createSortCondition() as any;
    const filters = this.filterService.getFilters();

    const data = await this.postsCommentsModel
      .find(filters)
      .sort(sort)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .lean();

    const amountOfItems = await this.postsCommentsModel.countDocuments(filters);

    return {
      page: pageNumber,
      pageSize,
      items: data,
      totalCount: amountOfItems,
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }
}
