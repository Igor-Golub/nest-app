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
import { CommentsQueryRepository } from '../../../comments/infrastructure';
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
} from '../models/input';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../../blogs/infrastructure';
import {
  UpdatePostCommand,
  DeletePostCommand,
  CreatePostCommand,
  UpdatePostLikeStatusCommand,
  CreatePostCommentCommand,
} from '../../application';
import { PostsViewMapperManager } from '../mappers';
import { CommentsViewMapperManager } from '../../../comments/api/mappers/comments';
import { UsersQueryRepository } from '../../../../users/infrastructure';
import { BasicAuthGuard, JwtAuthGuard } from '../../../../auth/guards';
import {
  CurrentUserId,
  UserIdFromAccessToken,
} from '../../../../../common/pipes';
import { PostsQueryRepository } from '../../infrastructure/posts.query.repo';
import { QueryParams } from '../../../../../common/decorators/validate';

@Controller('sa/posts')
export class AdminPostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly commentsQueryRepo: CommentsQueryRepository,
  ) {}

  @Get()
  public async getAll(
    @UserIdFromAccessToken() userId: string | undefined,
    @Query() query: PostsQueryParams,
  ) {
    return this.postsQueryRepository.getWithPagination(query, userId);
  }

  @Get(':id')
  public async getById(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') id: string,
  ) {
    const post = await this.postsQueryRepository.findById(id);

    if (!post) throw new NotFoundException();

    return PostsViewMapperManager.mapPostsToViewModelWithLikes(post, userId);
  }

  @Get(':id/comments')
  public async getComments(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') id: string,
    @Query() query: QueryParams,
  ) {
    const post = await this.postsQueryRepository.findById(id);

    if (!post) throw new NotFoundException();

    return this.commentsQueryRepo.getWithPagination(query, userId);
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

    if (!newPost) throw new NotFoundException();

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
    });

    const { commentId } = await this.commandBus.execute<
      CreatePostCommentCommand,
      { commentId: string }
    >(command);

    const comment = await this.commentsQueryRepo.findById(commentId);

    if (!comment) throw new BadRequestException();

    return CommentsViewMapperManager.commentWithoutLikesToViewModel(comment);
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

    return await this.commandBus.execute<UpdatePostLikeStatusCommand, void>(
      command,
    );
  }
}
