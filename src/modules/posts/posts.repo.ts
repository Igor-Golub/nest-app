import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument, PostModel } from './domain/postModel';
import { CreatePostDto } from './dto/createPostDto';
import { UpdatePostDto } from './dto/updatePostDto';

@Injectable()
export class PostsRepo {
  constructor(
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    return this.postModel.create(createPostDto);
  }

  public async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto);
  }

  public async delete(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }
}
