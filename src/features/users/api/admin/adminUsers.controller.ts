import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateUserDto,
  DeleteUserParams,
  GetUsersQueryParams,
} from '../models/input';
import { UsersQueryRepository } from '../../infrastructure';
import { BasicAuthGuard } from '../../../auth/guards';
import { CreateUserCommand, DeleteUserCommand } from '../../application';

@UseGuards(BasicAuthGuard)
@Controller('sa/users')
export class AdminUsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) {}

  @Get()
  public async getAll(@Query() query: GetUsersQueryParams) {
    return this.usersQueryRepo.findWithPagination(query);
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(createUserDto);

    return this.commandBus.execute<CreateUserCommand, { userId: string }>(
      command,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param() { id }: DeleteUserParams) {
    const command = new DeleteUserCommand({ id });

    const result = await this.commandBus.execute<DeleteUserCommand, boolean>(
      command,
    );

    if (!result) throw new NotFoundException();
  }
}
