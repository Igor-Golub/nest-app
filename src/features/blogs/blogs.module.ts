import { Module } from '@nestjs/common';
import { PostsController } from './posts/api/public/posts.controller';
import { BlogsController } from './blogs/api/public/blogs.controller';
import { CommentsController } from './comments/api/public/comments.controller';
import {
  CreateBlogHandler,
  CreatePostForBlogHandler,
  DeleteBlogHandler,
  UpdateBlogHandler,
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
import {
  DeleteCommentHandler,
  UpdateCommentLikeHandler,
  UpdateCommentLikeStatusHandler,
} from './comments/application';
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
import { UsersModule } from '../users/users.module';
import { PostsRepository } from './posts/infrastructure/posts.repo';
import { PostsLikesRepo } from './posts/infrastructure/postsLikes.repo';
import { PostsLikesQueryRepo } from './posts/infrastructure/postsLikes.query.repo';
import { PostsQueryRepository } from './posts/infrastructure/posts.query.repo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts/domain/post.entity';
import { PostLike } from './posts/domain/postLikes.entity';
import { AdminBlogsController } from './blogs/api/admin/adminBlogs.controller';
import { AdminPostsController } from './posts/api/admin/adminPosts.controller';

const blogsProviders = [
  BlogsRepository,
  BlogsQueryRepository,
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
  PostsCommentsLikesQueryRepository,
  CommentsQueryRepository,
  UpdateCommentLikeHandler,
  UpdateCommentLikeStatusHandler,
  DeleteCommentHandler,
  PostsCommentsLikesRepo,
];

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([Blog, Post, PostLike, PostComment, CommentLike]),
  ],
  controllers: [
    BlogsController,
    AdminBlogsController,
    PostsController,
    AdminPostsController,
    CommentsController,
  ],
  providers: [...blogsProviders, ...postsProviders, ...commentsProviders],
  exports: [
    BlogsQueryRepository,
    PostsQueryRepository,
    PostsLikesQueryRepo,
    PostsCommentsLikesQueryRepository,
  ],
})
export class BlogsModule {}
