import {
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

@Controller('comments')
export class CommentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get(':id')
  public async getById(@Param() { id }: CommentsQuery) {
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id/like-status')
  public async updateStatus(
    @Param('id') { id }: UpdateCommentLikeStatusParams,
    @Body() updateCommentDto: UpdateCommentLikeStatus,
  ) {
    const command = new UpdateCommentLikeStatusCommand({});

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return 'updateStatus';
  }

  // TODO: If try delete the comment that is not your own
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  public async update(
    @Param('id') { id }: UpdateCommentParams,
    @Body() updateCommentDto: UpdateComment,
  ) {
    const command = new UpdateCommentLikeCommand({});

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return 'update';
  }

  // TODO: If try delete the comment that is not your own
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteComment(@Param('id') { id }: DeleteCommentParams) {
    const command = new DeleteCommentCommand({});

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();

    return 'deleteComment';
  }
}
