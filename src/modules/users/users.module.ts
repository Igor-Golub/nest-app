import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepo } from './users.repo';
import { UsersQueryRepo } from './users.query.repo';
import { UserModel, UserSchema } from './domain/userEntity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepo, UsersQueryRepo],
  exports: [UsersService],
})
export class UsersModule {}
