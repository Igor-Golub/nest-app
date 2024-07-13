import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostsCommentsModel } from '../domain/postsCommentsModel';
import { Model } from 'mongoose';
import { LikeActions, LikeFields } from '../../../common/enums/Common';

interface CreatePostCommentDto {
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
}

@Injectable()
export class PostsCommentsRepo {
  constructor(
    @InjectModel(PostsCommentsModel.name)
    private readonly postCommentsModel: Model<PostsCommentsModel>,
  ) {}

  public async create(createPostCommentDto: CreatePostCommentDto) {
    return this.postCommentsModel.create(createPostCommentDto);
  }

  public async update(id: string, content: string) {
    return this.postCommentsModel.findByIdAndUpdate(id, { content });
  }

  public async delete(id: string) {
    return this.postCommentsModel.findByIdAndDelete(id);
  }

  public async updateCountOfLikes(
    id: string,
    conditions: {
      field: LikeFields;
      action: LikeActions;
    }[],
  ) {
    const incConditions = conditions.reduce((acc, { field, action }) => {
      acc[field] = action === LikeActions.INC ? 1 : -1;

      return acc;
    }, {});

    return this.postCommentsModel.findByIdAndUpdate(id, {
      $inc: incConditions,
    });
  }
}
