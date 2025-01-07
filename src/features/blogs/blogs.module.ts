import { Module } from '@nestjs/common';
import { PostsController } from './posts/api/posts.controller';
import { BlogsController } from './blogs/api/blogs.controller';
import { CommentsController } from './comments/api/comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CreateBlogHandler,
  CreatePostForBlogHandler,
  DeleteBlogHandler,
  UpdateBlogHandler,
} from './blogs/application';
import { BlogsQueryRepo, BlogsRepo } from './blogs/infrastructure';
import {
  CreatePostCommentHandler,
  CreatePostHandler,
  DeletePostHandler,
  UpdatePostHandler,
  UpdatePostLikeStatusHandler,
} from './posts/application';
import { PostsService } from './posts/application/posts.service';
import {
  DeleteCommentHandler,
  UpdateCommentLikeHandler,
  UpdateCommentLikeStatusHandler,
} from './comments/application';
import {
  CommentsQueryRepo,
  PostsCommentsLikesQueryRepo,
  PostsCommentsLikesRepo,
  PostsCommentsRepo,
} from './comments/infrastructure';
import { BlogModel, BlogSchema } from './blogs/domain/blogEntity';
import {
  PostsCommentsModel,
  PostsCommentsSchema,
} from './comments/domain/postsCommentsModel';
import {
  PostCommentLikeModel,
  PostCommentLikeSchema,
} from './comments/domain/postsCommentsLikesModel';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';
import { PostsRepository } from './posts/infrastructure/posts.repo';
import { PostsLikesRepo } from './posts/infrastructure/postsLikes.repo';
import { PostsLikesQueryRepo } from './posts/infrastructure/postsLikes.query.repo';
import { PostsQueryRepository } from './posts/infrastructure/posts.query.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/domain/post.entity';
import { PostLike } from './posts/domain/postLikes.entity';

const blogsProviders = [
  BlogsRepo,
  BlogsQueryRepo,
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreatePostForBlogHandler,
];

const postsProviders = [
  PostsService,
  PostsRepository,
  PostsLikesRepo,
  PostsLikesRepo,
  PostsQueryRepository,
  PostsLikesQueryRepo,
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  UpdatePostLikeStatusHandler,
  CreatePostCommentHandler,
];

const commentsProviders = [
  PostsCommentsRepo,
  PostsCommentsLikesQueryRepo,
  CommentsQueryRepo,
  UpdateCommentLikeHandler,
  UpdateCommentLikeStatusHandler,
  DeleteCommentHandler,
  PostsCommentsLikesRepo,
];

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([Post, PostLike]),
    MongooseModule.forFeature([
      { name: BlogModel.name, schema: BlogSchema },
      { name: PostsCommentsModel.name, schema: PostsCommentsSchema },
      { name: PostCommentLikeModel.name, schema: PostCommentLikeSchema },
    ]),
  ],
  controllers: [PostsController, BlogsController, CommentsController],
  providers: [...blogsProviders, ...postsProviders, ...commentsProviders],
  exports: [
    BlogsQueryRepo,
    PostsQueryRepository,
    PostsLikesQueryRepo,
    PostsCommentsLikesQueryRepo,
  ],
})
export class BlogsModule {}
