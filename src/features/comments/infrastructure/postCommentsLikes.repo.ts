import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostCommentLikeModel } from '../domain/postsCommentsLikesModel';
import { Model } from 'mongoose';
import { LikeStatus } from '../../../common/enums';

@Injectable()
export class PostsCommentsLikesRepo {
  constructor(
    @InjectModel(PostCommentLikeModel.name)
    private readonly postCommentLikeModel: Model<PostCommentLikeModel>,
  ) {}

  public async create(
    commentId: string,
    userId: string,
    userLogin: string,
    nextStatus: LikeStatus,
  ) {
    return this.postCommentLikeModel.create({
      userId,
      userLogin,
      nextStatus,
      parentId: commentId,
    });
  }

  public async updateStatus(likeId: string, nextStatus: LikeStatus) {
    return this.postCommentLikeModel.findByIdAndUpdate(likeId, {
      status: nextStatus,
    });
  }
}
