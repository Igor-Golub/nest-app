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
import { PostsQueryRepo } from '../infrastructure/posts.query.repo';
import { CommentsQueryRepo } from '../../comments/infrastructure/comments.query.repo';
import {
  CreatePostDto,
  DeletePostParams,
  PostsQueryParams,
  UpdatePostDto,
  UpdatePostParams,
  UpdatePostLikeStatus,
  UpdatePostLikeStatusParams,
  CreatePostCommentParams,
  CreatePostComment,
} from './models/input';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { FiltersType } from '../../../common/enums';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepo } from '../../blogs/infrastructure/blogs.query.repo';
import {
  UpdatePostCommand,
  DeletePostCommand,
  CreatePostCommand,
  UpdatePostLikeStatusCommand,
  CreatePostCommentCommand,
} from '../application';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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

  @Get(':id/comments')
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
  public delete(@Param() { id }: DeletePostParams) {
    const command = new DeletePostCommand({ id });

    return this.commandBus.execute(command);
  }

  @Post(':id/comments')
  public async createComment(
    @Param() { id }: CreatePostCommentParams,
    @Body() { content }: CreatePostComment,
  ) {
    const command = new CreatePostCommentCommand({ postId: id, content });

    return 'createComment';
  }

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  public async updateLikeStatus(
    @Param() { id }: UpdatePostLikeStatusParams,
    @Body() { likeStatus }: UpdatePostLikeStatus,
  ) {
    const command = new UpdatePostLikeStatusCommand({
      postId: id,
      likeStatus,
    });

    const result = await this.commandBus.execute(command);

    return 'updateLikeStatus';
  }
}
