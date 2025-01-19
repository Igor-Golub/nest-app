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
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../blogs/infrastructure';
import {
  UpdatePostCommand,
  DeletePostCommand,
  CreatePostCommand,
  UpdatePostLikeStatusCommand,
  CreatePostCommentCommand,
} from '../application';
import { PostsViewMapperManager } from './mappers';
import { CommentsViewMapperManager } from '../../comments/api/mappers/comments';
import { UsersQueryRepo } from '../../../users/infrastructure';
import { BasicAuthGuard, JwtAuthGuard } from '../../../auth/guards';
import { CurrentUserId, UserIdFromAccessToken } from '../../../../common/pipes';
import { PostsQueryRepository } from '../infrastructure/posts.query.repo';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly commentsQueryRepo: CommentsQueryRepo,
  ) {}

  @Get()
  public async getAll(
    @UserIdFromAccessToken() userId: string | undefined,
    @Query() query: PostsQueryParams,
  ) {
    const posts = await this.postsQueryRepository.getWithPagination(query);

    return {
      ...posts,
      items: PostsViewMapperManager.mapPostsToViewModelWithLikes(
        posts.items,
        userId,
      ),
    };
  }

  @Get(':id')
  public async getById(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') id: string,
  ) {
    const post = await this.postsQueryRepository.findById(id);

    if (!post) throw new NotFoundException();

    const [result] = PostsViewMapperManager.mapPostsToViewModelWithLikes(
      [post],
      userId,
    );

    return result;
  }

  @Get(':id/comments')
  public async getComments(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    const post = await this.postsQueryRepository.findById(id);

    if (!post) throw new NotFoundException();

    const data = await this.commentsQueryRepo.getWithPagination(query);

    return {
      ...data,
      items: data.items.map((comment) =>
        CommentsViewMapperManager.commentWithLikeToViewModel(comment, userId),
      ),
    };
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  public async create(@Body() createPostDto: CreatePostDto) {
    const blog = await this.blogsQueryRepo.findById(createPostDto.blogId);

    if (!blog) throw new NotFoundException();

    const command = new CreatePostCommand({
      data: { ...createPostDto, userId: 'userId' },
    });

    const createdPostId = await this.commandBus.execute(command);

    const newPost = await this.postsQueryRepository.findById(createdPostId);

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

    const post = await this.postsQueryRepository.findById(id);

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
    const post = await this.postsQueryRepository.findById(postId);

    if (!post) throw new NotFoundException();

    const command = new UpdatePostLikeStatusCommand({
      postId,
      nextLikeStatus,
      userId: currentUserId,
    });

    return await this.commandBus.execute(command);
  }
}
