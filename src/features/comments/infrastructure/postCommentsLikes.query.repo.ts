import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostCommentLikeModel } from '../domain/postsCommentsLikesModel';
import { Model } from 'mongoose';
import { LikeStatus } from '../../../common/enums';

@Injectable()
export class PostsCommentsLikesQueryRepo {
  constructor(
    @InjectModel(PostCommentLikeModel.name)
    private readonly postCommentLikeModel: Model<PostCommentLikeModel>,
  ) {}

  public async getLikeByCommentId(commentId: string) {
    return this.postCommentLikeModel.findOne({
      parentId: commentId,
    });
  }
}
