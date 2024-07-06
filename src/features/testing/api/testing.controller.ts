import { Model } from 'mongoose';
import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../../blogs/domain/blogEntity';
import { UserModel } from '../../users/domain/userEntity';
import { PostModel } from '../../posts/domain/postModel';
import { PostsCommentsModel } from '../../comments/domain/postsCommentsModel';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(BlogModel.name) private readonly blogModel: Model<BlogModel>,
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(PostsCommentsModel.name)
    private readonly commentsModel: Model<PostsCommentsModel>,
  ) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete() {
    await this.blogModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
  }
}
