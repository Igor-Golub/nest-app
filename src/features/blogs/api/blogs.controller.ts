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
import { BlogsQueryRepo } from '../infrastructure';
import { PostsQueryRepo } from '../../posts/infrastructure';
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
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
  CreatePostForBlogCommand,
} from '../application';
import { BasicAuthGuard } from '../../auth/guards';
import { BlogsViewMapperManager } from './mappers';
import { PostsViewMapperManager } from '../../posts/api/mappers';
import { BlogViewModel } from './models/output';

@Controller('blogs')
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<BlogViewModel>,
  ) {}

  @Get()
  public async getAll(@Query() query: BlogsQueryDto) {
    const { sortBy, sortDirection, pageNumber, pageSize, searchNameTerm } =
      query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.filterService.setValue('name', searchNameTerm, FiltersType.InnerText);
    this.sortingService.setValue(sortBy, sortDirection);

    const data = await this.blogsQueryRepo.getWithPagination();

    return {
      ...data,
      items: data.items.map(BlogsViewMapperManager.mapBlogsToViewModel),
    };
  }

  @Get(':id')
  public async getById(@Param() { id }: BlogsQueryDtoParams) {
    const blog = await this.blogsQueryRepo.getById(id);

    if (!blog) throw new NotFoundException();

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  public async create(@Body() createBlogDto: CreateBlogDto) {
    const command = new CreateBlogCommand(createBlogDto);

    const { id } = await this.commandBus.execute(command);

    const blog = await this.blogsQueryRepo.getById(id);

    return BlogsViewMapperManager.mapBlogsToViewModel(blog);
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

    const posts = await this.postsQueryRepo.getWithPagination();

    return {
      ...posts,
      items: posts.items.map(PostsViewMapperManager.mapPostsToViewModel),
    };
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  public async createPostForBlog(
    @Param() { id: blogId }: CreatePostForBlogParams,
    @Body() createCommentDto: CreatePostForBlogDto,
  ) {
    const blog = await this.blogsQueryRepo.getById(blogId);

    if (!blog) throw new NotFoundException();

    const command = new CreatePostForBlogCommand({
      blogId,
      blogName: blog.name,
      createData: createCommentDto,
    });

    const createdBlogId = await this.commandBus.execute(command);

    const post = await this.postsQueryRepo.getById(createdBlogId);

    return PostsViewMapperManager.mapPostsToViewModel(post);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
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
