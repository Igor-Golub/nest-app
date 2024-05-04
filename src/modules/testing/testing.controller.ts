import { Controller, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../blogs/domain/blogEntity';
import { UserModel } from '../users/domain/userEntity';
import { PostModel } from '../posts/domain/postModel';
import { CommentsModel } from '../comments/domain/commentsModel';
import { Model } from 'mongoose';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(BlogModel.name) private readonly blogModel: Model<BlogModel>,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(CommentsModel.name)
    private readonly commentsModel: Model<CommentsModel>,
  ) {}

  @Delete('all-data')
  public async delete() {
    this.blogModel.deleteMany({});
    this.userModel.deleteMany({});
    this.postModel.deleteMany({});
    this.commentsModel.deleteMany({});
  }
}
