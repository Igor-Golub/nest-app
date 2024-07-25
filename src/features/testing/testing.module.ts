import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostSchema } from '../posts/domain/postModel';
import {
  PostLikesModel,
  PostLikesSchema,
} from '../posts/domain/postLikesModel';
import { BlogModel, BlogSchema } from '../blogs/domain/blogEntity';
import {
  PostsCommentsModel,
  PostsCommentsSchema,
} from '../comments/domain/postsCommentsModel';
import {
  PostCommentLikeModel,
  PostCommentLikeSchema,
} from '../comments/domain/postsCommentsLikesModel';
import { UserModel, UserSchema } from '../users/domain/userEntity';

const imports = [
  MongooseModule.forFeature([
    { name: PostModel.name, schema: PostSchema },
    { name: PostLikesModel.name, schema: PostLikesSchema },
    { name: BlogModel.name, schema: BlogSchema },
    { name: PostsCommentsModel.name, schema: PostsCommentsSchema },
    { name: PostCommentLikeModel.name, schema: PostCommentLikeSchema },
    { name: UserModel.name, schema: UserSchema },
  ]),
];

@Module({
  imports,
  controllers: [TestingController],
})
export class TestingModule {}
