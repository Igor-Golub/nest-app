import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostSchema } from '../blogs/posts/domain/postModel';
import {
  PostLikesModel,
  PostLikesSchema,
} from '../blogs/posts/domain/postLikesModel';
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
      { name: PostModel.name, schema: PostSchema },
      { name: BlogModel.name, schema: BlogSchema },
      { name: PostLikesModel.name, schema: PostLikesSchema },
      { name: PostsCommentsModel.name, schema: PostsCommentsSchema },
      { name: PostCommentLikeModel.name, schema: PostCommentLikeSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
