import { Module } from '@nestjs/common';
import { PostsController } from './posts/api/public/posts.controller';
import { BlogsController } from './blogs/api/public/blogs.controller';
import { CommentsController } from './comments/api/public/comments.controller';
import {
  CreateBlogHandler,
  DeleteBlogHandler,
  UpdateBlogHandler,
  CreateBlogPostHandler,
  UpdateBlogPostHandler,
  DeleteBlogPostHandler,
} from './blogs/application';
import { BlogsQueryRepository, BlogsRepository } from './blogs/infrastructure';
import {
  CreatePostCommentHandler,
  CreatePostHandler,
  DeletePostHandler,
  UpdatePostHandler,
  UpdatePostLikeStatusHandler,
} from './posts/application';
import { PostsService } from './posts/application/posts.service';
import { DeleteCommentHandler, UpdateCommentLikeHandler, UpdateCommentLikeStatusHandler } from './comments/application';
import {
  CommentsQueryRepository,
  PostsCommentsLikesQueryRepository,
  PostsCommentsLikesRepo,
  PostsCommentsRepo,
} from './comments/infrastructure';
import { Blog } from './blogs/domain/blog.entity';
import { PostComment } from './comments/domain/postComment.entity';
import { CommentLike } from './comments/domain/commentLike.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users';
import { PostsRepository } from './posts/infrastructure/posts.repo';
import { PostsLikesRepo } from './posts/infrastructure/postsLikes.repo';
import { PostsQueryRepository } from './posts/infrastructure/posts.query.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/domain/post.entity';
import { PostLike } from './posts/domain/postLikes.entity';
import { AdminBlogsController } from './blogs/api/admin/adminBlogs.controller';
import { AdminPostsController } from './posts/api/admin/adminPosts.controller';
import { BlogsResolver } from './blogs/api/graphql/blogs.resolver';

const blogsProviders = [
  BlogsRepository,
  BlogsQueryRepository,
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreateBlogPostHandler,
  UpdateBlogPostHandler,
  DeleteBlogPostHandler,
  BlogsResolver,
];

const postsProviders = [
  PostsService,
  PostsRepository,
  PostsLikesRepo,
  PostsLikesRepo,
  PostsQueryRepository,
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  UpdatePostLikeStatusHandler,
  CreatePostCommentHandler,
];

const commentsProviders = [
  PostsCommentsRepo,
  PostsCommentsLikesQueryRepository,
  CommentsQueryRepository,
  UpdateCommentLikeHandler,
  UpdateCommentLikeStatusHandler,
  DeleteCommentHandler,
  PostsCommentsLikesRepo,
];

@Module({
  imports: [CqrsModule, UsersModule, TypeOrmModule.forFeature([Blog, Post, PostLike, PostComment, CommentLike])],
  controllers: [BlogsController, AdminBlogsController, PostsController, AdminPostsController, CommentsController],
  providers: [...blogsProviders, ...postsProviders, ...commentsProviders],
  exports: [BlogsRepository, BlogsQueryRepository, PostsQueryRepository, PostsCommentsLikesQueryRepository],
})
export class BlogsModule {}
