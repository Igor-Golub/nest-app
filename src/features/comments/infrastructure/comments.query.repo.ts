import { Injectable, NotFoundException } from '@nestjs/common';
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
      totalCount: amountOfItems,
      items: data.map(this.mapToViewModel),
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }

  private mapToViewModel(comment): ViewModels.Comment {
    const {
      _id,
      content,
      userId,
      userLogin,
      likesCount,
      dislikesCount,
      currentLikeStatus,
    } = comment;

    return {
      id: _id?.toString(),
      createdAt: _id?.getTimestamp()?.toISOString(),
      content,
      commentatorInfo: { userId, userLogin },
      likesInfo: {
        likesCount,
        dislikesCount,
        myStatus: currentLikeStatus,
      },
    };
  }
}
