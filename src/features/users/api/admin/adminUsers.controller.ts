import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserViewModel } from '../models/output';
import { CreateUserDto, GetUsersQueryParams } from '../models/input';
import { UsersQueryRepo } from '../../infrastructure';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';
import { CreateUserCommand } from '../../application';
import { CommandBus } from '@nestjs/cqrs';

@Controller('sa/users')
export class AdminUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepo,
  ) {}

  @Get()
  public async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewModel[]>> {
    return this.usersQueryRepo.findWithPagination(query);
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(createUserDto);

    return this.commandBus.execute<CreateUserCommand, string>(command);
  }
}
