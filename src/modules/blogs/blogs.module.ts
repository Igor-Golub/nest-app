import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogSchema } from './domain/blogEntity';
import { BlogsService } from './blogs.service';
import { BlogsRepo } from './blogs.repo';
import { BlogsQueryRepo } from './blogs.query.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlogModel.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepo, BlogsQueryRepo],
  exports: [BlogsService],
})
export class BlogsModule {}
