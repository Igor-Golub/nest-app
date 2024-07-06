import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostLikesModel } from '../domain/postLikesModel';
import { LikeStatus } from '../../../common/enums';

@Injectable()
export class PostsLikesRepo {
  constructor(
    @InjectModel(PostLikesModel.name)
    private readonly postLikesModel: Model<PostLikesModel>,
  ) {}

  public async findLikeByUserIdAndPostId(userId: string, postId: string) {
    return this.postLikesModel.findOne({ userId, postId }).lean();
  }

  public async create(userId: string, postId: string, status: LikeStatus) {
    return this.postLikesModel.create({
      postId,
      status,
      userId,
    });
  }

  public async updateStatus(likeId: string, likeStatus: LikeStatus) {
    return this.postLikesModel.findOneAndUpdate(
      {
        _id: likeId,
      },
      {
        status: likeStatus,
      },
    );
  }
}
