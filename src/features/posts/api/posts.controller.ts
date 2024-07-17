import {
  BadRequestException,
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
import { PostsQueryRepo } from '../infrastructure';
import { CommentsQueryRepo } from '../../comments/infrastructure';
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
import { BlogsQueryRepo } from '../../blogs/infrastructure';
import {
  UpdatePostCommand,
  DeletePostCommand,
  CreatePostCommand,
  UpdatePostLikeStatusCommand,
  CreatePostCommentCommand,
} from '../application';
import { BasicAuthGuard, JwtAuthGuard } from '../../auth/guards';
import { CurrentUserId } from '../../../common/pipes/current.userId';
import { UsersQueryRepo } from '../../users/infrastructure';
import { mapCommentsToViewModel, PostsViewMapperManager } from './mappers';
import { BlogsViewMapperManager } from '../../blogs/api/mappers';
import { PostsLikesQueryRepo } from '../infrastructure';
import { UserIdFromAccessToken } from '../../../common/pipes/userId.from.token';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly postsLikesQueryRepo: PostsLikesQueryRepo,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly commentsQueryRepo: CommentsQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Post>,
  ) {}

  @Get()
  public async getAll(
    @UserIdFromAccessToken() userId: string | null,
    @Query() query: PostsQueryParams,
  ) {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);

    const posts = await this.postsQueryRepo.getWithPagination();

    return {
      ...posts,
      items: posts.items.map(PostsViewMapperManager.mapPostsToViewModel),
    };
  }

  @Get(':id')
  public async getById(
    @UserIdFromAccessToken() userId: string | null,
    @Param('id') id: string,
  ) {
    const post = await this.postsQueryRepo.getById(id);

    if (!post) throw new NotFoundException();

    const postViewModel = PostsViewMapperManager.mapPostsToViewModel(post);

    if (userId) {
      const like = await this.postsLikesQueryRepo.findLikeByUserIdAndPostId(
        userId,
        id,
      );

      return PostsViewMapperManager.addLikeStatus(postViewModel, like?.status);
    } else {
      return postViewModel;
    }
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

    const data = await this.commentsQueryRepo.getWithPagination();

    return {
      ...data,
      items: data.items.map((comment) => mapCommentsToViewModel(comment)),
    };
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  public async create(@Body() createPostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepo.getById(createPostDto.blogId);

    if (!blog) throw new NotFoundException();

    const viewBlog = BlogsViewMapperManager.mapBlogsToViewModel(blog);

    const command = new CreatePostCommand({
      blog: viewBlog,
      data: createPostDto,
    });

    return this.commandBus.execute(command);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public delete(@Param() { id }: DeletePostParams) {
    const command = new DeletePostCommand({ id });

    return this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  public async createComment(
    @CurrentUserId() currentUserId: string,
    @Param() { id }: CreatePostCommentParams,
    @Body() { content }: CreatePostComment,
  ) {
    const user = await this.usersQueryRepo.getById(currentUserId);

    if (!user) throw new BadRequestException();

    const post = await this.postsQueryRepo.getById(id);

    if (!post) throw new BadRequestException();

    const command = new CreatePostCommentCommand({
      content,
      postId: id,
      userId: currentUserId,
      userLogin: user.login,
    });

    const result = await this.commandBus.execute(command);

    if (!result) throw new BadRequestException();

    return mapCommentsToViewModel(result);
  }

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  public async updateLikeStatus(
    @CurrentUserId() currentUserId: string,
    @Param() { id }: UpdatePostLikeStatusParams,
    @Body() { likeStatus }: UpdatePostLikeStatus,
  ) {
    const post = await this.postsQueryRepo.getById(id);

    if (!post) throw new NotFoundException();

    const command = new UpdatePostLikeStatusCommand({
      postId: id,
      nextLikeStatus: likeStatus,
      userId: currentUserId,
    });

    return await this.commandBus.execute(command);
  }
}
