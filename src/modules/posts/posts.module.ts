import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModel, PostSchema } from './domain/postModel';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepo } from './posts.repo';
import { PostsQueryRepo } from './posts.query.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PostModel.name,
        schema: PostSchema,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepo, PostsQueryRepo],
  exports: [PostsService],
})
export class PostsModule {}
