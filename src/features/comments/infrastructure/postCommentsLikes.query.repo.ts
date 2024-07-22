import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostCommentLikeModel } from '../domain/postsCommentsLikesModel';
import { Model } from 'mongoose';

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

  public async findCommentsLikesByCommentId(commentId: string) {
    return this.postCommentLikeModel.find({ parentId: commentId });
  }
}
