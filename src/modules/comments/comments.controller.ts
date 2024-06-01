import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepo } from './comments.query.repo';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsQueryRepo: CommentsQueryRepo) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.commentsQueryRepo.getById(id);
  }
}
