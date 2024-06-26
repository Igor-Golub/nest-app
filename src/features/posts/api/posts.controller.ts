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
import { PostsQueryRepo } from '../infrastructure/posts.query.repo';
import { CommentsQueryRepo } from '../../comments/infrastructure/comments.query.repo';
import {
  UpdatePostDto,
  CreatePostDto,
  PostsQueryParams,
  DeletePostParams,
  UpdatePostParams,
} from './models/input';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { FiltersType } from '../../../common/enums';

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
  public async getAll(@Query() query: PostsQueryParams) {
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
  update(
    @Param() { id }: UpdatePostParams,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() { id }: DeletePostParams) {
    return this.postsService.delete(id);
  }
}
