import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPostDto';
import { UpdatePostDto } from './dto/updatePostDto';
import { PaginationService } from '../../application/pagination.service';
import { ClientSortingService } from '../../application/clientSorting.service';
import { PostsQueryRepo } from './posts.query.repo';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
  ) {}

  @Get()
  getAll(@Query() query: Api.CommonQuery) {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);

    return this.postsQueryRepo.getWithPagination();
  }

  @Get()
  getById(@Param('id') id: string) {
    return this.postsService.findById(id);
  }

  @Get()
  getComments(@Param('id') id: string) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put()
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete()
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
