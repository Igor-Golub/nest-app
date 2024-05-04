import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentsModel } from './domain/commentsModel';
import { Model } from 'mongoose';
import { LikeStatus } from '../../enums/Common';

@Injectable()
export class CommentsQueryRepo {
  constructor(
    @InjectModel(CommentsModel.name)
    private readonly commentsModel: Model<CommentsModel>,
  ) {}

  public async getById(id: number) {
    const comment = this.commentsModel.findById(id);

    return this.mapToViewModel(comment);
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
