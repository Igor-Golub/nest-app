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
import { UserViewModel } from './models/output';
import { DeleteUserParams } from './models/input';
import { BasicAuthGuard } from '../../auth/guards';
import { UsersQueryRepo } from '../infrastructure';
import { GetUsersQueryParams, CreateUserDto } from './models/input';
import { CreateUserCommand, DeleteUserCommand } from '../application';
import { PaginatedViewDto } from '../../../common/dto/base.paginated.view-dto';

@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
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

    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param() { id }: DeleteUserParams) {
    const command = new DeleteUserCommand({ id });

    const result = await this.commandBus.execute(command);

    if (!result) throw new NotFoundException();
  }
}
