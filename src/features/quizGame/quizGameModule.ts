import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController, AdminQuizController } from './api';
import { Game, Answer, Stats, Question, Participant } from './domain';
import { TransactionService } from '../../infrastructure/services/transaction.service';
import {
  GameQueryRepo,
  QuestionQueryRepo,
  GameRepo,
  QuestionRepo,
  AnswerQueryRepo,
  StatisticsQueryRepo,
} from './infrastructure';
import {
  GameService,
  StatsService,
  TimerService,
  AnswerService,
  MatchmakingService,
  AnswerCommandHandler,
  ConnectCommandHandler,
  DeleteQuestionHandler,
  CreateQuestionHandler,
  UpdateQuestionHandler,
  PublishQuestionHandler,
} from './application';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Game, Answer, Stats, Question, Participant])],
  providers: [
    GameRepo,
    GameService,
    StatsService,
    QuestionRepo,
    TimerService,
    AnswerService,
    GameQueryRepo,
    AnswerQueryRepo,
    QuestionQueryRepo,
    MatchmakingService,
    StatisticsQueryRepo,
    AnswerCommandHandler,
    ConnectCommandHandler,
    DeleteQuestionHandler,
    CreateQuestionHandler,
    UpdateQuestionHandler,
    PublishQuestionHandler,
    TransactionService,
  ],
  controllers: [GameController, AdminQuizController],
  exports: [GameRepo],
})
export class QuizGameModule {}
