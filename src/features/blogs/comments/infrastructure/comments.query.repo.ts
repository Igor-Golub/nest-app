import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostCommentEntity } from '../domain/postComment.entity';
import { Model } from 'mongoose';

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectModel(PostCommentEntity.name)
    private readonly postsCommentsModel: Model<PostCommentEntity>,
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
    return {
      page: 1,
      pageSize: 1,
      items: [],
      totalCount: 1,
      pagesCount: 1,
    };
  }
}
