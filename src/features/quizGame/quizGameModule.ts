import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameQueryRepo } from './infrastructure';
import { GameController, AdminBlogsController } from './api';
import {
  ConnectCommandHandler,
  AnswerCommandHandler,
  GameService,
} from './application';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([])],
  providers: [
    GameQueryRepo,
    GameService,
    AnswerCommandHandler,
    ConnectCommandHandler,
  ],
  controllers: [GameController, AdminBlogsController],
  exports: [],
})
export class QuizGameModule {}
