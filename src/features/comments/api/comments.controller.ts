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
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateCommentLikeStatusCommand } from '../application/updateStatus.useCase';
import { UpdateCommentLikeCommand } from '../application/update.useCase';
import { DeleteCommentCommand } from '../application/delete.useCase';
import { DeleteCommentParams } from './models/input/deleteComment';
import {
  UpdateComment,
  UpdateCommentParams,
} from './models/input/updateComment';
import {
  UpdateCommentLikeStatus,
  UpdateCommentLikeStatusParams,
} from './models/input/updateCommentLikeStatus';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsQuery } from './models/input/commentQuery';
import { CommentsQueryRepo } from '../infrastructure/comments.query.repo';
import { CurrentUserId } from '../../../common/pipes/current.userId';
import { UsersQueryRepo } from '../../users/infrastructure/users.query.repo';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly commentsQueryRepo: CommentsQueryRepo,
  ) {}

  @Get(':id')
  public async getById(@Param() { id }: CommentsQuery) {
    const comment = await this.commentsQueryRepo.getById(id);

    if (!comment) throw new NotFoundException();

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment._id._id.getTimestamp(),
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus: comment.currentLikeStatus,
      },
    };
  }

  // TODO: If try delete the comment that is not your own
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  public async update(
    @Param() { id }: UpdateCommentParams,
    @Body() updateCommentDto: UpdateComment,
  ) {
    const command = new UpdateCommentLikeCommand({
      id,
      content: updateCommentDto.content,
    });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();
  }

  // TODO: If try delete the comment that is not your own
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param() { id }: DeleteCommentParams) {
    const command = new DeleteCommentCommand({ id });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();
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
