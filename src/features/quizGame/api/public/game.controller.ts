import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AnswerModel } from '../models/input';
import { GameMapManager } from '../models/mappers';
import { JwtAuthGuard } from '../../../auth/guards';
import { CurrentUserId } from '../../../../common/pipes';
import { AnswerCommand, ConnectCommand } from '../../application';
import { GameQueryRepo, AnswerQueryRepo } from '../../infrastructure';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly gameQueryRepo: GameQueryRepo,
    private readonly answerQueryRepo: AnswerQueryRepo,
  ) {}

  @Get('pairs/my-current')
  async myCurrent(@CurrentUserId() userId: string) {
    const game = await this.gameQueryRepo.findByParticipantId(userId);
    return GameMapManager.mapGameToView(game);
  }

  @Get('pairs/:id')
  async pairs(@CurrentUserId() userId: string, @Param('id') id: string) {
    const isHasAccess = await this.gameQueryRepo.checkIsUserHasAccessToGame(id, userId);
    if (!isHasAccess) throw new ForbiddenException();

    const game = await this.gameQueryRepo.findById(id);
    return GameMapManager.mapGameToView(game);
  }

  @Post('pairs/connection')
  async connect(@CurrentUserId() userId: string) {
    const connect = new ConnectCommand({ userId });

    const gameId = await this.commandBus.execute<ConnectCommand, string>(connect);

    const game = await this.gameQueryRepo.findById(gameId);

    return GameMapManager.mapGameToView(game);
  }

  @Post('pairs/my-current/answer')
  async answer(@CurrentUserId() userId: string, @Body() { answer: inputAnswer }: AnswerModel) {
    const game = await this.gameQueryRepo.findByParticipantId(userId);

    const command = new AnswerCommand({ userId, answer: inputAnswer, gameId: game.id });

    const answerId = await this.commandBus.execute<AnswerCommand, string>(command);

    const answer = await this.answerQueryRepo.findById(answerId);

    return GameMapManager.mapAnswersToView(answer);
  }
}
