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
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepo } from '../infrastructure/blogs.query.repo';
import { PostsQueryRepo } from '../../posts/infrastructure/posts.query.repo';
import {
  BlogsQueryDtoParams,
  UpdateBlogParams,
  UpdateBlogDto,
  BlogsQueryDto,
  CreateBlogDto,
  CreatePostForBlogDto,
  DeleteBlogParams,
  CreatePostForBlogParams,
} from './models/input';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { FiltersType } from '../../../common/enums';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/create.blog.useCase';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { DeleteBlogCommand } from '../application/delete.blog.useCase';
import { UpdateBlogCommand } from '../application/update.blog.useCase';
import { CreatePostForBlogCommand } from '../application/create.post.for.blog.useCase';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Blog>,
  ) {}

  @Get()
  public async getAll(@Query() query: BlogsQueryDto) {
    const { sortBy, sortDirection, pageNumber, pageSize, searchNameTerm } =
      query;

    this.paginationService.setValues({ pageSize, pageNumber });

    this.filterService.setValue('name', searchNameTerm, FiltersType.InnerText);

    this.sortingService.setValue(sortBy, sortDirection);

    return this.blogsQueryRepo.getWithPagination();
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  public async create(@Body() createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto);

    const { id } = await this.commandBus.execute(command);

    return await this.blogsQueryRepo.getById(id);
  }

  @Get(':id')
  public async getById(@Param() { id }: BlogsQueryDtoParams) {
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

    return this.postsQueryRepo.getWithPaginationAndSorting();
  }

  @Post(':id/posts')
  public async createPostForBlog(
    @Param() { id: blogId }: CreatePostForBlogParams,
    @Body() createCommentDto: CreatePostForBlogDto,
  ) {
    const blog = await this.blogsQueryRepo.getById(blogId);

    if (!blog) throw new NotFoundException();

    const command = new CreatePostForBlogCommand({
      blogId,
      createData: createCommentDto,
    });

    const createdBlogId = await this.commandBus.execute(command);

    return this.postsQueryRepo.getById(createdBlogId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param() { id }: UpdateBlogParams,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    const command = new UpdateBlogCommand({ id, updateData: updateBlogDto });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param()
    { id }: DeleteBlogParams,
  ) {
    const command = new DeleteBlogCommand({ id });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return true;
  }
}
