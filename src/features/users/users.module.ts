import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './api/public/users.controller';
import { ConfirmationQueryRepo, ConfirmationRepository, UsersQueryRepository, UsersRepository } from './infrastructure';
import { CreateUserHandler, DeleteUserHandler, UsersService } from './application';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Confirmation } from './domain/confirm.entity';
import { AdminUsersController } from './api/admin/adminUsers.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Confirmation])],
  providers: [
    UsersRepository,
    UsersQueryRepository,
    UsersService,
    CryptoService,
    CreateUserHandler,
    DeleteUserHandler,
    ConfirmationRepository,
    ConfirmationQueryRepo,
  ],
  controllers: [UsersController, AdminUsersController],
  exports: [UsersService, UsersQueryRepository, UsersRepository],
})
export class UsersModule {}
