import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { UsersModule } from '../users/users.module';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [UsersModule, BlogsModule],
  controllers: [TestingController],
})
export class TestingModule {}
