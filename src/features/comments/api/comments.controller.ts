import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards';
import {
  DeleteCommentCommand,
  UpdateCommentLikeCommand,
  UpdateCommentLikeStatusCommand,
} from '../application';
import {
  CommentsQuery,
  DeleteCommentParams,
  UpdateComment,
  UpdateCommentLikeStatus,
  UpdateCommentLikeStatusParams,
  UpdateCommentParams,
} from './models/input';
import { CommandBus } from '@nestjs/cqrs';
import {
  CommentsQueryRepo,
  PostsCommentsLikesQueryRepo,
} from '../infrastructure';
import { CurrentUserId } from '../../../common/pipes/current.userId';
import { UsersQueryRepo } from '../../users/infrastructure';
import { CommentsViewMapperManager } from './mappers/comments';
import { UserIdFromAccessToken } from '../../../common/pipes/userId.from.token';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly postsCommentsLikesQueryRepo: PostsCommentsLikesQueryRepo,
    private readonly commentsQueryRepo: CommentsQueryRepo,
  ) {}

  @Get(':id')
  public async getById(
    @Param() { id }: CommentsQuery,
    @UserIdFromAccessToken() userId: string | undefined,
  ) {
    const comment = await this.commentsQueryRepo.getById(id);

    if (!comment) throw new NotFoundException();

    const likes =
      await this.postsCommentsLikesQueryRepo.findCommentsLikesByCommentId(id);

    return CommentsViewMapperManager.commentWithLikeToViewModel(
      comment,
      likes,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  public async update(
    @Param() { id }: UpdateCommentParams,
    @CurrentUserId() currentUserId: string,
    @Body() updateCommentDto: UpdateComment,
  ) {
    const isCommentExist = await this.commentsQueryRepo.isCommentExist(id);

    if (!isCommentExist) throw new NotFoundException();

    const isOwnerComment = await this.commentsQueryRepo.isOwnerComment(
      id,
      currentUserId,
    );

    if (!isOwnerComment) throw new ForbiddenException();

    const command = new UpdateCommentLikeCommand({
      id,
      content: updateCommentDto.content,
    });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(
    @Param() { id }: DeleteCommentParams,
    @CurrentUserId() currentUserId: string,
  ) {
    const isCommentExist = await this.commentsQueryRepo.isCommentExist(id);

    if (!isCommentExist) throw new NotFoundException();

    const isOwnerComment = await this.commentsQueryRepo.isOwnerComment(
      id,
      currentUserId,
    );

    if (!isOwnerComment) throw new ForbiddenException();

    const command = new DeleteCommentCommand({ id });

    await this.commandBus.execute(command);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/like-status')
  public async updateStatus(
    @CurrentUserId() currentUserId: string,
    @Param() { id: commentId }: UpdateCommentLikeStatusParams,
    @Body() updateCommentDto: UpdateCommentLikeStatus,
  ) {
    const { likeStatus } = updateCommentDto;

    const isCommentExist =
      await this.commentsQueryRepo.isCommentExist(commentId);

    if (!isCommentExist) new NotFoundException();

    const user = await this.usersQueryRepo.getById(currentUserId);

    if (!user) throw new BadRequestException();

    const command = new UpdateCommentLikeStatusCommand({
      commentId,
      nextStatus: likeStatus,
      userLogin: user.login,
      userId: currentUserId,
    });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();
  }
}
