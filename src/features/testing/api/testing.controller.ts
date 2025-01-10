import { Model } from 'mongoose';
import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../../blogs/blogs/domain/blog.entity';
import { PostCommentLikeModel } from '../../blogs/comments/domain/commentLike.entity';
import { PostCommentEntity } from '../../blogs/comments/domain/postComment.entity';
import { UsersService } from '../../users/application';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(BlogModel.name) private readonly blogModel: Model<BlogModel>,
    @InjectModel(PostCommentLikeModel.name)
    private readonly postCommentLikeModel: Model<PostCommentLikeModel>,
    @InjectModel(PostCommentEntity.name)
    private readonly commentsModel: Model<PostCommentEntity>,
    private userService: UsersService,
  ) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete() {
    await this.blogModel.deleteMany({});
    await this.commentsModel.deleteMany({});
    await this.postCommentLikeModel.deleteMany({});
  }
}
