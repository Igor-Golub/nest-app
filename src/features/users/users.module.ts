import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './api/users.controller';
import { UsersQueryRepo, UsersRepo } from './infrastructure';
import { UserModel, UserSchema } from './domain/userEntity';
import { CreateUserHandler, DeleteUserHandler } from './application';
import { PaginationService } from '../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../infrastructure/services/filter.service';
import { CryptoService } from '../../infrastructure/services/crypto.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  providers: [
    UsersRepo,
    CryptoService,
    UsersQueryRepo,
    PaginationService,
    ClientFilterService,
    ClientSortingService,
    CreateUserHandler,
    DeleteUserHandler,
  ],
  controllers: [UsersController],
  exports: [UsersQueryRepo, UsersRepo],
})
export class UsersModule {}
