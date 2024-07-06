import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel } from '../domain/postModel';
import { UpdatePostDto } from '../api/models/input';
import { LikeStatus } from '../../../common/enums';

@Injectable()
export class PostsRepo {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
  ) {}

  public async create(createPostDto: DBModels.Post) {
    return this.postModel.create(createPostDto);
  }

  public async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto);
  }

  public async delete(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }

  public async updateLikes(id: string, status: LikeStatus) {
    return this.postModel.findByIdAndUpdate(id, {
      currentLikeStatus: status,
    });
  }

  public async getById(id: string) {
    return this.postModel.findById(id).lean();
  }
}
