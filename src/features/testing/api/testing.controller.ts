import { Model } from 'mongoose';
import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../../blogs/blogs/domain/blogEntity';
import { PostModel } from '../../blogs/posts/domain/postModel';
import { PostLikesModel } from '../../blogs/posts/domain/postLikesModel';
import { PostCommentLikeModel } from '../../blogs/comments/domain/postsCommentsLikesModel';
import { PostsCommentsModel } from '../../blogs/comments/domain/postsCommentsModel';
import { UsersService } from '../../users/application';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(BlogModel.name) private readonly blogModel: Model<BlogModel>,
    @InjectModel(PostModel.name) private readonly postModel: Model<PostModel>,
    @InjectModel(PostLikesModel.name)
    private readonly postLikesModel: Model<PostLikesModel>,
    @InjectModel(PostCommentLikeModel.name)
    private readonly postCommentLikeModel: Model<PostCommentLikeModel>,
    @InjectModel(PostsCommentsModel.name)
    private readonly commentsModel: Model<PostsCommentsModel>,
    private userService: UsersService,
  ) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete() {
    await this.blogModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userService.dropUserTable();
    await this.userService.dropConfirmationTable();
    await this.postLikesModel.deleteMany({});
    await this.postCommentLikeModel.deleteMany({});
  }
}
