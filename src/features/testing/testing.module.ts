import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogSchema } from '../blogs/blogs/domain/blogEntity';
import {
  PostsCommentsModel,
  PostsCommentsSchema,
} from '../blogs/comments/domain/postsCommentsModel';
import {
  PostCommentLikeModel,
  PostCommentLikeSchema,
} from '../blogs/comments/domain/postsCommentsLikesModel';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogSchema },
      { name: PostsCommentsModel.name, schema: PostsCommentsSchema },
      { name: PostCommentLikeModel.name, schema: PostCommentLikeSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
