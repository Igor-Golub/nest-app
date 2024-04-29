import { Module } from '@nestjs/common';
import { TestingController } from './testing/testing.controller';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { BlogsController } from './blogs/blogs.controller';
import { BlogsService } from './blogs/blogs.service';


@Module({
  imports: [],
  controllers: [
    BlogsController,
    UsersController,
    PostsController,
    TestingController,
    CommentsController,
  ],
  providers: [
    BlogsService,
    UsersService,
    PostsService,
    CommentsService,
  ],
})

export class AppModule {
}
