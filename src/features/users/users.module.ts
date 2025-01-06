import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './api/users.controller';
import {
  UsersRepository,
  UsersQueryRepo,
  ConfirmationRepo,
  ConfirmationQueryRepo,
} from './infrastructure';
import {
  CreateUserHandler,
  DeleteUserHandler,
  UsersService,
} from './application';
import { PaginationService } from '../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../infrastructure/services/filter.service';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Confirmation } from './domain/confirm.entity';
import { Account } from './domain/account.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User, Confirmation, Account]),
  ],
  providers: [
    UsersRepository,
    UsersQueryRepo,
    UsersService,
    CryptoService,
    CreateUserHandler,
    DeleteUserHandler,
    PaginationService,
    ConfirmationRepo,
    ClientFilterService,
    ClientSortingService,
    ConfirmationQueryRepo,
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersQueryRepo],
})
export class UsersModule {}
