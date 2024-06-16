import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from './application/services/pagination.service';
import { ClientSortingService } from './application/services/clientSorting.service';
import { ClientFilterService } from './application/services/filter.service';
import { TestingController } from './modules/testing/testing.controller';
import { CommentsController } from './modules/comments/comments.controller';
import { CommentsService } from './modules/comments/comments.service';
import { PostsController } from './modules/posts/posts.controller';
import { PostsService } from './modules/posts/posts.service';
import { BlogsController } from './modules/blogs/blogs.controller';
import { BlogsRepo } from './modules/blogs/blogs.repo';
import { BlogsQueryRepo } from './modules/blogs/blogs.query.repo';
import { PostsRepo } from './modules/posts/posts.repo';
import { PostsQueryRepo } from './modules/posts/posts.query.repo';
import { BlogsService } from './modules/blogs/blogs.service';
import { BlogModel, BlogSchema } from './modules/blogs/domain/blogEntity';
import { PostModel, PostSchema } from './modules/posts/domain/postModel';
import {
  CommentsModel,
  CommentsSchema,
} from './modules/comments/domain/commentsModel';
import { CommentsQueryRepo } from './modules/comments/comments.query.repo';
import { CommentsRepo } from './modules/comments/comments.repo';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

const imports = [
  ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.MONGO_URL!.toString()),
  MongooseModule.forFeature([
    {
      name: BlogModel.name,
      schema: BlogSchema,
    },
    {
      name: PostModel.name,
      schema: PostSchema,
    },
    {
      name: CommentsModel.name,
      schema: CommentsSchema,
    },
  ]),
  AuthModule,
  UsersModule,
];

const controllers = [
  BlogsController,
  PostsController,
  TestingController,
  CommentsController,
];

const providers = [
  BlogsService,
  BlogsRepo,
  BlogsQueryRepo,
  PostsService,
  PostsRepo,
  PaginationService,
  ClientSortingService,
  ClientFilterService,
  PostsQueryRepo,
  CommentsService,
  CommentsQueryRepo,
  CommentsRepo,
];

@Module({
  imports,
  controllers,
  providers,
})
export class AppModule {}
