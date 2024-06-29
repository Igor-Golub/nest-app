import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { CreatePostDto } from './models/input/createPostDto';
import { UpdatePostDto } from './models/input/updatePostDto';
import { PaginationService } from '@app/infrastructure/services/pagination.service';
import { ClientSortingService } from '@app/infrastructure/services/clientSorting.service';
import { PostsQueryRepo } from '../infrastructure/posts.query.repo';
import { CommentsQueryRepo } from '../../comments/infrastructure/comments.query.repo';
import { FiltersType } from '@app/common/enums/Filters';
import { ClientFilterService } from '@app/infrastructure/services/filter.service';
import { QueryValidator } from './models/input/query';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly commentsQueryRepo: CommentsQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Post>,
  ) {}

  @Get()
  public async getAll(@Query() query: QueryValidator) {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);

    return this.postsQueryRepo.getWithPagination();
  }

  @Get(':id')
  public async getById(@Param('id') id: string) {
    return this.postsQueryRepo.getById(id);
  }

  @Get(':id')
  public async getComments(
    @Param('id') id: string,
    @Query() query: Api.CommonQuery,
  ) {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);
    this.filterService.setValue('postId', id, FiltersType.ById);

    return this.commentsQueryRepo.getWithPagination();
  }

  @Post()
  public async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
