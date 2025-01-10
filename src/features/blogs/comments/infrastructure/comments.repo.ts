import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostCommentEntity } from '../domain/postComment.entity';
import { Model } from 'mongoose';

interface CreatePostCommentDto {
  postId: string;
  content: string;
  userId: string;
  userLogin: string;
}

@Injectable()
export class PostsCommentsRepo {
  constructor(
    @InjectModel(PostCommentEntity.name)
    private readonly postCommentsModel: Model<PostCommentEntity>,
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
}
