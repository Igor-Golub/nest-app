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
import { DeleteCommentCommand, UpdateCommentLikeCommand, UpdateCommentLikeStatusCommand } from '../../application';
import {
  CommentsQuery,
  DeleteCommentParams,
  UpdateComment,
  UpdateCommentLikeStatus,
  UpdateCommentLikeStatusParams,
  UpdateCommentParams,
} from '../models/input';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsQueryRepository } from '../../infrastructure';
import { CommentsViewMapperManager } from '../mappers/comments';
import { UsersQueryRepository } from '../../../../users/infrastructure';
import { CurrentUserId, UserIdFromAccessToken } from '../../../../../common/pipes';
import { JwtAuthGuard } from '../../../../auth/guards';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepository,
    private readonly commentsQueryRepo: CommentsQueryRepository,
  ) {}

  @Get(':id')
  public async getById(@Param() { id: commentId }: CommentsQuery, @UserIdFromAccessToken() userId: string | undefined) {
    const comment = await this.commentsQueryRepo.findById(commentId);

    if (!comment) throw new NotFoundException();

    return CommentsViewMapperManager.commentWithLikeToViewModel(comment, userId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  public async update(
    @Param() { id }: UpdateCommentParams,
    @CurrentUserId() currentUserId: string,
    @Body() updateCommentDto: UpdateComment,
  ) {
    const comment = await this.commentsQueryRepo.findById(id);

    if (!comment) throw new NotFoundException();

    const isOwnerComment = await this.commentsQueryRepo.isOwnerComment(id, currentUserId);

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
  public async delete(@Param() { id }: DeleteCommentParams, @CurrentUserId() currentUserId: string) {
    const comment = await this.commentsQueryRepo.findById(id);

    if (!comment) throw new NotFoundException();

    const isOwnerComment = await this.commentsQueryRepo.isOwnerComment(id, currentUserId);

    if (!isOwnerComment) throw new ForbiddenException();

    const command = new DeleteCommentCommand({ id });

    await this.commandBus.execute<DeleteCommentCommand, boolean>(command);
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

    const comment = await this.commentsQueryRepo.findById(commentId);

    if (!comment) throw new NotFoundException();

    const user = await this.usersQueryRepo.findById(currentUserId);

    if (!user) throw new BadRequestException();

    const command = new UpdateCommentLikeStatusCommand({
      commentId,
      userId: currentUserId,
      nextStatus: likeStatus,
    });

    const result = await this.commandBus.execute<UpdateCommentLikeStatusCommand>(command);

    if (!result) throw new NotFoundException();
  }
}
