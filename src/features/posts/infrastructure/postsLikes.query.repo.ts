import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostLikesModel } from '../domain/postLikesModel';

@Injectable()
export class PostsLikesQueryRepo {
  constructor(
    @InjectModel(PostLikesModel.name)
    private readonly postLikesModel: Model<PostLikesModel>,
  ) {}

  public async findLikeByUserIdAndPostId(userId: string, postId: string) {
    return this.postLikesModel.findOne({ postId, userId }).lean();
  }

  public async findLikesByIds(ids: string[]) {
    return this.postLikesModel
      .find({ postId: { $in: ids } })
      .sort({ createdAt: 'desc' })
      .lean();
  }
}
