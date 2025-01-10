import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogSchema } from '../blogs/blogs/domain/blog.entity';
import {
  PostCommentEntity,
  PostsCommentsSchema,
} from '../blogs/comments/domain/postComment.entity';
import {
  PostCommentLikeModel,
  PostCommentLikeSchema,
} from '../blogs/comments/domain/commentLike.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogSchema },
      { name: PostCommentEntity.name, schema: PostsCommentsSchema },
      { name: PostCommentLikeModel.name, schema: PostCommentLikeSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
