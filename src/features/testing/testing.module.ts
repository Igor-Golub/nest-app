import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../users/domain/userEntity';
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
import { SessionModel, SessionSchema } from '../auth/domain/sessionEntity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostModel.name, schema: PostSchema },
      { name: BlogModel.name, schema: BlogSchema },
      { name: UserModel.name, schema: UserSchema },
      { name: PostLikesModel.name, schema: PostLikesSchema },
      { name: PostsCommentsModel.name, schema: PostsCommentsSchema },
      { name: PostCommentLikeModel.name, schema: PostCommentLikeSchema },
      { name: SessionModel.name, schema: SessionSchema },
    ]),
  ],
  controllers: [TestingController],
})
export class TestingModule {}
