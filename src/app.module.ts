import { Module } from '@nestjs/common';
import { TestingController } from './modules/testing/testing.controller';
import { CommentsController } from './modules/comments/comments.controller';
import { CommentsService } from './modules/comments/comments.service';
import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { PostsController } from './modules/posts/posts.controller';
import { PostsService } from './modules/posts/posts.service';
import { BlogsController } from './modules/blogs/blogs.controller';
import { BlogsService } from './modules/blogs/blogs.service';

@Module({
  imports: [],
  controllers: [
    BlogsController,
    UsersController,
    PostsController,
    TestingController,
    CommentsController,
  ],
  providers: [BlogsService, UsersService, PostsService, CommentsService],
})
export class AppModule {}
