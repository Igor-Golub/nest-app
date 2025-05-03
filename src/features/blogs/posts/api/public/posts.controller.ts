import {
  BadRequestException,
  Body,
  Controller,
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
  CreatePostComment,
  CreatePostCommentParams,
  PostsQueryParams,
  UpdatePostLikeStatus,
  UpdatePostLikeStatusParams,
} from '../models/input';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreatePostCommentCommand,
  UpdatePostLikeStatusCommand,
} from '../../application';
import { PostsViewMapperManager } from '../mappers';
import { CommentsViewMapperManager } from '../../../comments/api/mappers/comments';
import { UsersQueryRepository } from '../../../../users/infrastructure';
import { JwtAuthGuard } from '../../../../auth/guards';
import {
  CurrentUserId,
  UserIdFromAccessToken,
} from '../../../../../common/pipes';
import { PostsQueryRepository } from '../../infrastructure/posts.query.repo';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly usersQueryRepo: UsersQueryRepository,
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

    return PostsViewMapperManager.mapPostsToViewModelWithLikes(
      post,
      post.likes,
      userId,
    );
  }

  @Get(':id/comments')
  public async getComments(
    @UserIdFromAccessToken() userId: string | undefined,
    @Param('id') id: string,
    @Query() query: PostsQueryParams,
  ) {
    const post = await this.postsQueryRepository.findById(id);

    if (!post) throw new NotFoundException();

    return this.commentsQueryRepo.getWithPagination(query, userId, id);
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
