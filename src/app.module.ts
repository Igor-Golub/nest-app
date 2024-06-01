import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from './application/pagination.service';
import { ClientSortingService } from './application/clientSorting.service';
import { ClientFilterService } from './application/filter.service';
import { TestingController } from './modules/testing/testing.controller';
import { CommentsController } from './modules/comments/comments.controller';
import { CommentsService } from './modules/comments/comments.service';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { PostsController } from './modules/posts/posts.controller';
import { PostsService } from './modules/posts/posts.service';
import { BlogsController } from './modules/blogs/blogs.controller';
import { BlogsRepo } from './modules/blogs/blogs.repo';
import { BlogsQueryRepo } from './modules/blogs/blogs.query.repo';
import { PostsRepo } from './modules/posts/posts.repo';
import { PostsQueryRepo } from './modules/posts/posts.query.repo';
import { UsersRepo } from './modules/users/users.repo';
import { UsersQueryRepo } from './modules/users/users.query.repo';
import { BlogsService } from './modules/blogs/blogs.service';
import { BlogModel, BlogSchema } from './modules/blogs/domain/blogEntity';
import { UserModel, UserSchema } from './modules/users/domain/userEntity';
import { PostModel, PostSchema } from './modules/posts/domain/postModel';
import {
  CommentsModel,
  CommentsSchema,
} from './modules/comments/domain/commentsModel';
import { CommentsQueryRepo } from './modules/comments/comments.query.repo';
import { CommentsRepo } from './modules/comments/comments.repo';
import { ConfigModule } from '@nestjs/config';

const imports = [
  ConfigModule.forRoot(),
  MongooseModule.forRoot(process.env.MONGO_URL!.toString()),
  MongooseModule.forFeature([
    {
      name: BlogModel.name,
      schema: BlogSchema,
    },
    {
      name: UserModel.name,
      schema: UserSchema,
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
];

const controllers = [
  BlogsController,
  UsersController,
  PostsController,
  TestingController,
  CommentsController,
];

const providers = [
  BlogsService,
  BlogsRepo,
  BlogsQueryRepo,
  UsersService,
  UsersRepo,
  UsersQueryRepo,
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
