import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/createBlogDto';
import { UpdateBlogDto } from './dto/updateBlogDto';
import { PaginationService } from '../../application/pagination.service';
import { ClientSortingService } from '../../application/clientSorting.service';
import { BlogsQueryRepo } from './blogs.query.repo';
import { ClientFilterService } from '../../application/filter.service';
import { FiltersType } from '../../enums/Filters';
import { CreatePostDto } from '../posts/dto/createPostDto';
import { PostsQueryRepo } from '../posts/posts.query.repo';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly postsQueryRepo: PostsQueryRepo,
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

  @Get(':id/posts')
  public async getPostsOfBlog(
    @Param('id') blogId: string,
    @Query() query: Api.CommonQuery,
  ) {
    const blog = await this.blogsQueryRepo.getById(blogId);

    if (!blog) throw new NotFoundException();

    const { sortBy, sortDirection, pageNumber, pageSize } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);
    this.filterService.setValue('blogId', blogId, FiltersType.ById);

    return this.postsQueryRepo.getWithPagination();
  }

  @Post(':id/posts')
  public async createPostForBlog(
    @Param('id') blogId: string,
    @Body() createCommentDto: Omit<CreatePostDto, 'blogId'>,
  ) {
    const blog = await this.blogsQueryRepo.getById(blogId);

    if (!blog) throw new NotFoundException();

    return this.blogsService.createPostForBlog(blogId, createCommentDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string) {
    return this.blogsService.delete(id);
  }
}
