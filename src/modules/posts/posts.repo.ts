import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostModel } from './domain/postModel';

@Injectable()
export class PostsRepo {
  constructor(
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
  ) {}
}
