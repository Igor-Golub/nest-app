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

  public async isLikeForCommentExist(commentId: string) {
    return this.postCommentLikeModel.countDocuments({ commentId }).lean();
  }

  public async findCommentsLikesByCommentId(commentId: string) {
    return this.postCommentLikeModel.find({ commentId }).lean();
  }

  public async findLikeByUserIdAndCommentId(userId: string, commentId: string) {
    return this.postCommentLikeModel.findOne({ userId, commentId }).lean();
  }

  public async findLikesByIds(ids: string[]) {
    return this.postCommentLikeModel.find({ commentId: { $in: ids } }).lean();
  }
}
