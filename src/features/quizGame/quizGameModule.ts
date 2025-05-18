import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController, AdminQuizController } from './api';
import { GameQueryRepo, QuestionQueryRepo } from './infrastructure';
import { Game, Answer, Stats, Question, Participant } from './domain';
import {
  GameService,
  StatsService,
  TimerService,
  AnswerService,
  MatchmakingService,
  AnswerCommandHandler,
  ConnectCommandHandler,
  DeleteQuestionHandler,
} from './application';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Game, Answer, Stats, Question, Participant]),
  ],
  providers: [
    GameQueryRepo,
    QuestionQueryRepo,
    GameService,
    StatsService,
    TimerService,
    AnswerService,
    MatchmakingService,
    AnswerCommandHandler,
    ConnectCommandHandler,
    DeleteQuestionHandler,
  ],
  controllers: [GameController, AdminQuizController],
  exports: [],
})
export class QuizGameModule {}
