import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
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
import { UsersRepo } from './modules/users/users.repo';
import { BlogsService } from './modules/blogs/blogs.service';
import { BlogModel, BlogSchema } from './modules/blogs/domain/blogEntity';
import { UserModel, UserSchema } from './modules/users/domain/userEntity';
import { PostModel, PostSchema } from './modules/posts/domain/postModel';
import {
  CommentsModel,
  CommentsSchema,
} from './modules/comments/domain/commentsModel';
import dbConfiguration from './config/dbConfiguration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfiguration],
    }),
    MongooseModule.forRoot(
      'mongodb+srv://gitihonovich:OogKFXMl7zIWdip4@cluster0.ugjfheu.mongodb.net/blogs',
    ),
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
  ],
  controllers: [
    BlogsController,
    UsersController,
    PostsController,
    TestingController,
    CommentsController,
  ],
  providers: [
    BlogsService,
    BlogsRepo,
    BlogsQueryRepo,
    UsersService,
    UsersRepo,
    PostsService,
    PostsRepo,
    CommentsService,
    PaginationService,
    ClientSortingService,
    ClientFilterService,
  ],
})
export class AppModule {}
