import { Controller, Get, Param } from '@nestjs/common';
import { CommentsQueryRepo } from './comments.query.repo';
import { PaginationService } from '../../application/pagination.service';
import { ClientSortingService } from '../../application/clientSorting.service';
import { ClientFilterService } from '../../application/filter.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepo: CommentsQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Comment>,
  ) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.commentsQueryRepo.getById(id);
  }
}
