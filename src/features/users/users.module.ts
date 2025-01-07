import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './api/public/users.controller';
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
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Confirmation } from './domain/confirm.entity';
import { Account } from './domain/account.entity';
import { AdminUsersController } from './api/admin/adminUsers.controller';

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
    ConfirmationRepo,
    ConfirmationQueryRepo,
  ],
  controllers: [UsersController, AdminUsersController],
  exports: [UsersService, UsersQueryRepo],
})
export class UsersModule {}
