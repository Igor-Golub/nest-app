import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsModel } from '../domain/commentsModel';
import { Model } from 'mongoose';
import { LikeStatus } from '../../../common/enums/Common';
import { PaginationService } from '../../../infrastructure/pagination.service';
import { ClientSortingService } from '../../../infrastructure/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/filter.service';

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectModel(CommentsModel.name)
    private readonly commentsModel: Model<CommentsModel>,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Comment>,
  ) {}

  public async getById(id: string) {
    const comment = this.commentsModel.findById(id).lean();

    if (!comment) throw new NotFoundException();

    return this.mapToViewModel(comment);
  }

  public async getWithPagination() {
    const { pageNumber, pageSize } = this.paginationService.getPagination();
    const sort = this.sortingService.createSortCondition();
    const filters = this.filterService.getFilters();
  }

  private mapToViewModel(
    comment: DBModels.MongoResponseEntity<DBModels.Comment>,
  ): ViewModels.Comment {
    const {
      _id,
      content,
      commentatorInfo: { userId: commentatorInfoUserId, userLogin },
    } = comment;

    return {
      id: _id.toString(),
      createdAt: _id.getTimestamp().toISOString(),
      content,
      commentatorInfo: { userId: commentatorInfoUserId, userLogin },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    };
  }
}
