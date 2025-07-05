import {
  Get,
  Body,
  Post,
  Param,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { GameMapManager } from '../models/mappers';
import { JwtAuthGuard } from '../../../auth/guards';
import { StatisticViewModel } from '../models/output';
import { AnswerModel, PairParam } from '../models/input';
import { CurrentUserId } from '../../../../common/pipes';
import { AnswerCommand, ConnectCommand } from '../../application';
import { AnswerQueryRepo, GameQueryRepo, StatisticsQueryRepo, HistoryQueryRepo } from '../../infrastructure';
import { QueryParams } from '../../../../common/decorators/validate';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pair-game-quiz')
export class GameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly gameQueryRepo: GameQueryRepo,
    private readonly answerQueryRepo: AnswerQueryRepo,
    private readonly historyQueryRepo: HistoryQueryRepo,
    private readonly statisticsQueryRepo: StatisticsQueryRepo,
  ) {}

  @ApiOperation({ summary: 'Get all user games (include current)' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiOkResponse({ description: 'User history games and current' })
  @Get('pairs/my')
  async history(@CurrentUserId() userId: string, @Param() queryParams: QueryParams) {
    return this.historyQueryRepo.getHistoryAndCurrent(queryParams, userId);
  }

  @ApiOperation({ summary: 'Get current user statistic' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiOkResponse({ description: 'User statistic', type: StatisticViewModel })
  @Get('users/my-statistic')
  async statistic(@CurrentUserId() userId: string) {
    return this.statisticsQueryRepo.getUserStatistic(userId);
  }

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
  async pairs(@CurrentUserId() userId: string, @Param() { id }: PairParam) {
    await this.gameQueryRepo.isGameExist(id);

    const isHasAccess = await this.gameQueryRepo.checkIsUserHasAccessToGame(id, userId);
    if (!isHasAccess) throw new ForbiddenException();

    const game = await this.gameQueryRepo.findById(id);
    return GameMapManager.mapGameToView(game);
  }

  @ApiOperation({
    summary: 'Connect user to game',
  })
  @ApiOkResponse({
    description: 'Game connected or created',
  })
  @ApiForbiddenResponse({
    description: 'User already in game',
  })
  @HttpCode(HttpStatus.OK)
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
  @ApiOkResponse({
    description: 'Answer saved',
  })
  @ApiForbiddenResponse({
    description: 'User not in game or Game not ready yet or Answered for all queries',
  })
  @HttpCode(HttpStatus.OK)
  @Post('pairs/my-current/answers')
  async answer(@CurrentUserId() userId: string, @Body() { answer: inputAnswer }: AnswerModel) {
    const game = await this.gameQueryRepo.findByParticipantId(userId, HttpStatus.FORBIDDEN);

    const command = new AnswerCommand({ userId, answer: inputAnswer, gameId: game.id });

    const answerId = await this.commandBus.execute<AnswerCommand, string>(command);

    const answer = await this.answerQueryRepo.findById(answerId);

    return GameMapManager.mapAnswersToView(answer);
  }
}
