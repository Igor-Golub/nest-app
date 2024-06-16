import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModel, CommentsSchema } from './domain/commentsModel';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentsRepo } from './comments.repo';
import { CommentsQueryRepo } from './comments.query.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CommentsModel.name,
        schema: CommentsSchema,
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepo, CommentsQueryRepo],
  exports: [CommentsService],
})
export class CommentsModule {}
