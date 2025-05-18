import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController, AdminQuizController } from './api';
import { Game, Answer, Stats, Question, Participant } from './domain';
import {
  GameQueryRepo,
  QuestionQueryRepo,
  GameRepo,
  QuestionRepo,
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
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Game, Answer, Stats, Question, Participant]),
  ],
  providers: [
    GameRepo,
    GameQueryRepo,
    QuestionRepo,
    QuestionQueryRepo,
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
  ],
  controllers: [GameController, AdminQuizController],
  exports: [],
})
export class QuizGameModule {}
