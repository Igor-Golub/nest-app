import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostCommentLikeModel } from '../domain/commentLike.entity';
import { Model } from 'mongoose';
import { LikeStatus } from '../../../../common/enums';

@Injectable()
export class PostsCommentsLikesRepo {
  constructor(
    @InjectModel(PostCommentLikeModel.name)
    private readonly postCommentLikeModel: Model<PostCommentLikeModel>,
  ) {}

  public async create(dto: {
    commentId: string;
    userId: string;
    userLogin: string;
    status: LikeStatus;
  }) {
    return this.postCommentLikeModel.create(dto);
  }

  public async updateStatus(likeId: string, nextStatus: LikeStatus) {
    return this.postCommentLikeModel.findByIdAndUpdate(likeId, {
      status: nextStatus,
    });
  }
}
