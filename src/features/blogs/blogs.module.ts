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
  PostsLikesQueryRepo,
  PostsLikesRepo,
  PostsQueryRepo,
  PostsRepo,
} from './posts/infrastructure';
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
import { PostModel, PostSchema } from './posts/domain/postModel';
import { PostLikesModel, PostLikesSchema } from './posts/domain/postLikesModel';
import { BlogModel, BlogSchema } from './blogs/domain/blogEntity';
import {
  PostsCommentsModel,
  PostsCommentsSchema,
} from './comments/domain/postsCommentsModel';
import {
  PostCommentLikeModel,
  PostCommentLikeSchema,
} from './comments/domain/postsCommentsLikesModel';
import { PaginationService } from '../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../infrastructure/services/filter.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from '../users/users.module';

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
  PostsRepo,
  PostsQueryRepo,
  PostsLikesRepo,
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
    MongooseModule.forFeature([
      {
        name: PostModel.name,
        schema: PostSchema,
      },
      {
        name: PostLikesModel.name,
        schema: PostLikesSchema,
      },
      {
        name: BlogModel.name,
        schema: BlogSchema,
      },
      {
        name: PostsCommentsModel.name,
        schema: PostsCommentsSchema,
      },
      {
        name: PostCommentLikeModel.name,
        schema: PostCommentLikeSchema,
      },
    ]),
  ],
  controllers: [PostsController, BlogsController, CommentsController],
  providers: [
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    PaginationService,
    ClientSortingService,
    ClientFilterService,
  ],
  exports: [
    BlogsQueryRepo,
    PostsQueryRepo,
    PostsLikesQueryRepo,
    PostsCommentsLikesQueryRepo,
  ],
})
export class BlogsModule {}
