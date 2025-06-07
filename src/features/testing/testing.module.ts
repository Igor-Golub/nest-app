import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { UsersModule } from '../users';
import { BlogsModule } from '../blogs';
import { QuizGameModule } from '../quizGame';

@Module({
  imports: [UsersModule, BlogsModule, QuizGameModule],
  controllers: [TestingController],
})
export class TestingModule {}
