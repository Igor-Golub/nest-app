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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { CreateCommentDto } from '../comments/dto/createCommentDto';
import { PaginationService } from '../../application/pagination.service';
import { ClientSortingService } from '../../application/clientSorting.service';
import { BlogsQueryRepo } from './blogs.query.repo';
import { ClientFilterService } from '../../application/filter.service';
import { FiltersType } from '../../enums/Filters';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Blog>,
  ) {}

  @Get()
  public async getAll(@Query() query: Api.BlogQuery) {
    const { sortBy, sortDirection, pageNumber, pageSize, searchNameTerm } =
      query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.filterService.setValue('name', searchNameTerm, FiltersType.InnerText);
    this.sortingService.setValue(sortBy, sortDirection);

    return this.blogsQueryRepo.getWithPagination();
  }

  @Post()
  public async create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.create(createBlogDto);
  }

  @Get(':id')
  public async getById(@Param('id') id: string) {
    return this.blogsQueryRepo.getById(id);
  }

  @Get(':id')
  public async getPosts(@Param('id') blogId: string) {}

  @Post(':id')
  public async createPost(
    @Param('id') blogId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {}

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
