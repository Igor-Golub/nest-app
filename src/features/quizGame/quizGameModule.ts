import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameQueryRepo } from './infrastructure';
import { GameController, AdminQuizController } from './api';
import { Game, Answer, Stats, Question, Participant } from './domain';
import {
  GameService,
  StatsService,
  TimerService,
  AnswerService,
  MatchmakingService,
  AnswerCommandHandler,
  ConnectCommandHandler,
} from './application';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Game, Answer, Stats, Question, Participant]),
  ],
  providers: [
    GameQueryRepo,
    GameService,
    StatsService,
    TimerService,
    AnswerService,
    MatchmakingService,
    AnswerCommandHandler,
    ConnectCommandHandler,
  ],
  controllers: [GameController, AdminQuizController],
  exports: [],
})
export class QuizGameModule {}
