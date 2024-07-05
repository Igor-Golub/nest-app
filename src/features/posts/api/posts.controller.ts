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
import { PostsQueryRepo } from '../infrastructure/posts.query.repo';
import { CommentsQueryRepo } from '../../comments/infrastructure/comments.query.repo';
import {
  CreatePostDto,
  DeletePostParams,
  PostsQueryParams,
  UpdatePostDto,
  UpdatePostParams,
} from './models/input';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { FiltersType } from '../../../common/enums';
import { CreatePostCommand } from '../application/create.useCase';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepo } from '../../blogs/infrastructure/blogs.query.repo';
import { UpdatePostCommand } from '../application/update.useCase';
import { DeleteBlogCommand } from '../../blogs/application/delete.blog.useCase';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly blogsQueryRepo: BlogsQueryRepo,
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
    const blog = await this.blogsQueryRepo.getById(createPostDto.blogId);

    if (!blog) throw new NotFoundException();

    const command = new CreatePostCommand({ blog, data: createPostDto });

    return this.commandBus.execute(command);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param() { id }: UpdatePostParams,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const command = new UpdatePostCommand({ postId: id, data: updatePostDto });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return true;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param() { id }: DeletePostParams) {
    const command = new DeleteBlogCommand({ id });

    return this.commandBus.execute(command);
  }
}
