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
import {
  CommentsQueryRepo,
  PostsCommentsLikesQueryRepo,
} from '../../comments/infrastructure';
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
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepo } from '../../blogs/infrastructure';
import {
  UpdatePostCommand,
  DeletePostCommand,
  CreatePostCommand,
  UpdatePostLikeStatusCommand,
  CreatePostCommentCommand,
} from '../application';
import { PostsViewMapperManager } from './mappers';
import { BlogsViewMapperManager } from '../../blogs/api/mappers';
import { PostsLikesQueryRepo } from '../infrastructure';
import { CommentsViewMapperManager } from '../../comments/api/mappers/comments';
import { PostsService } from '../application/posts.service';
import { UsersQueryRepo } from '../../../users/infrastructure';
import { PaginationService } from '../../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../../infrastructure/services/filter.service';
import { FiltersType } from '../../../../common/enums';
import { BasicAuthGuard, JwtAuthGuard } from '../../../auth/guards';
import { CurrentUserId, UserIdFromAccessToken } from '../../../../common/pipes';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsService: PostsService,
    private readonly postsQueryRepo: PostsQueryRepo,
    private readonly postsLikesQueryRepo: PostsLikesQueryRepo,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly blogsQueryRepo: BlogsQueryRepo,
    private readonly commentsQueryRepo: CommentsQueryRepo,
    private readonly postsCommentsLikesQueryRepo: PostsCommentsLikesQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Post>,
  ) {}

  @Get()
  public async getAll(
    @UserIdFromAccessToken() userId: string | undefined,
    @Query() query: PostsQueryParams,
  ) {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);

    const posts = await this.postsQueryRepo.getWithPagination();

    const postsLikes = this.postsService.getPostsIds(posts.items);

    const likes = await this.postsLikesQueryRepo.findLikesByIds(postsLikes);

    return {
      ...posts,
      items: PostsViewMapperManager.mapPostsToViewModelWithLikes(
        posts.items,
        likes,
        userId,
      ),
    };
  }

  @Get(':id')
  public async getById(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') id: string,
  ) {
    const post = await this.postsQueryRepo.getById(id);

    if (!post) throw new NotFoundException();

    const likes = await this.postsLikesQueryRepo.findLikesByIds([
      post._id.toString(),
    ]);

    return PostsViewMapperManager.mapPostsToViewModelWithLikes(
      [post],
      likes,
      userId,
    )[0];
  }

  @Get(':id/comments')
  public async getComments(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') id: string,
    @Query() query: Api.CommonQuery,
  ) {
    const post = await this.postsQueryRepo.getById(id);

    if (!post) throw new NotFoundException();

    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);
    this.filterService.setValue('postId', id, FiltersType.ById);

    const data = await this.commentsQueryRepo.getWithPagination();

    const commentsLikes = await this.postsCommentsLikesQueryRepo.findLikesByIds(
      data.items.map(({ _id }) => _id.toString()),
    );

    return {
      ...data,
      items: data.items.map((comment) =>
        CommentsViewMapperManager.commentWithLikeToViewModel(
          comment,
          commentsLikes,
          userId,
        ),
      ),
    };
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  public async create(@Body() createPostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepo.getById(createPostDto.blogId);

    const viewBlog = BlogsViewMapperManager.mapBlogsToViewModel(blog);

    const command = new CreatePostCommand({
      blog: viewBlog,
      data: createPostDto,
    });

    const createdPostId = await this.commandBus.execute(command);

    const newPost = await this.postsQueryRepo.getById(createdPostId);

    return PostsViewMapperManager.addDefaultLikesData(newPost);
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
    const user = await this.usersQueryRepo.findById(currentUserId);

    if (!user) throw new BadRequestException();

    const post = await this.postsQueryRepo.getById(id);

    if (!post) throw new NotFoundException();

    const command = new CreatePostCommentCommand({
      content,
      postId: id,
      userId: currentUserId,
      userLogin: user.login,
    });

    const result = await this.commandBus.execute(command);

    if (!result) throw new BadRequestException();

    return CommentsViewMapperManager.commentWithoutLikesToViewModel(result);
  }

  @Put(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateLikeStatus(
    @CurrentUserId() currentUserId: string,
    @Param() { id: postId }: UpdatePostLikeStatusParams,
    @Body() { likeStatus: nextLikeStatus }: UpdatePostLikeStatus,
  ) {
    const post = await this.postsQueryRepo.getById(postId);

    if (!post) throw new NotFoundException();

    const user = await this.usersQueryRepo.findById(currentUserId);

    const command = new UpdatePostLikeStatusCommand({
      postId,
      nextLikeStatus,
      userId: currentUserId,
      userLogin: user!.login,
    });

    return await this.commandBus.execute(command);
  }
}
