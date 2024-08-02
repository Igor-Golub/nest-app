import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './api/users.controller';
import { UsersRepo, UsersQueryRepo } from './infrastructure';
import {
  CreateUserHandler,
  DeleteUserHandler,
  UsersService,
} from './application';
import { PaginationService } from '../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../infrastructure/services/filter.service';
import { CryptoService } from '../../infrastructure/services/crypto.service';

@Module({
  imports: [CqrsModule],
  providers: [
    UsersRepo,
    UsersQueryRepo,
    UsersService,
    CryptoService,
    CreateUserHandler,
    DeleteUserHandler,
    PaginationService,
    ClientFilterService,
    ClientSortingService,
  ],
  controllers: [UsersController],
  exports: [UsersService, UsersQueryRepo],
})
export class UsersModule {}
