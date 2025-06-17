import { Body, Controller, ForbiddenException, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AnswerModel } from '../models/input';
import { GameMapManager } from '../models/mappers';
import { JwtAuthGuard } from '../../../auth/guards';
import { CurrentUserId } from '../../../../common/pipes';
import { AnswerCommand, ConnectCommand } from '../../application';
import { GameQueryRepo, AnswerQueryRepo } from '../../infrastructure';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pair-game-quiz')
export class GameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly gameQueryRepo: GameQueryRepo,
    private readonly answerQueryRepo: AnswerQueryRepo,
  ) {}

  @ApiOperation({
    summary: 'Get user game',
  })
  @Get('pairs/my-current')
  async myCurrent(@CurrentUserId() userId: string) {
    const game = await this.gameQueryRepo.findByParticipantId(userId);
    return GameMapManager.mapGameToView(game);
  }

  @ApiOperation({
    summary: 'Get game by id',
  })
  @Get('pairs/:id')
  async pairs(@CurrentUserId() userId: string, @Param('id') id: string) {
    const isHasAccess = await this.gameQueryRepo.checkIsUserHasAccessToGame(id, userId);
    if (!isHasAccess) throw new ForbiddenException();

    const game = await this.gameQueryRepo.findById(id);
    return GameMapManager.mapGameToView(game);
  }

  @ApiOperation({
    summary: 'Connect user to game',
  })
  @Post('pairs/connection')
  async connect(@CurrentUserId() userId: string) {
    const connect = new ConnectCommand({ userId });

    const gameId = await this.commandBus.execute<ConnectCommand, string>(connect);

    const game = await this.gameQueryRepo.findById(gameId);

    return GameMapManager.mapGameToView(game);
  }

  @ApiOperation({
    summary: 'Send answer for next not answered question in active game',
  })
  @Post('pairs/my-current/answers')
  async answer(@CurrentUserId() userId: string, @Body() { answer: inputAnswer }: AnswerModel) {
    const game = await this.gameQueryRepo.findByParticipantId(userId);

    const command = new AnswerCommand({ userId, answer: inputAnswer, gameId: game.id });

    const answerId = await this.commandBus.execute<AnswerCommand, string>(command);

    const answer = await this.answerQueryRepo.findById(answerId);

    return GameMapManager.mapAnswersToView(answer);
  }
}
