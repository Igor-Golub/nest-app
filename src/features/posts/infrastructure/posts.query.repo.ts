import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel } from '../domain/postModel';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { LikeStatus } from '../../../common/enums';

@Injectable()
export class PostsQueryRepo {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Post>,
  ) {}

  public async getById(id: string) {
    const post = await this.postModel.findById(id);

    if (!post) throw new NotFoundException();

    return this.mapToViewModels([post])[0];
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
      totalCount: amountOfItems,
      items: this.mapToViewModels(data),
      pagesCount: Math.ceil(amountOfItems / pageSize),
    };
  }

  private mapToViewModels(
    data: DBModels.MongoResponseEntity<DBModels.Post>[],
  ): ViewModels.PostWithFullLikes[] {
    return data.map(
      ({ _id, content, blogName, blogId, title, shortDescription }) => ({
        id: _id.toString(),
        createdAt: _id.getTimestamp().toISOString(),
        content,
        blogName,
        blogId,
        title,
        shortDescription,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatus.None,
          newestLikes: [],
        },
      }),
    );
  }
}
