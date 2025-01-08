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
import { UserViewModel } from '../models/output';
import { UsersQueryRepo } from '../../infrastructure';
import { BasicAuthGuard } from '../../../auth/guards';
import { CreateUserCommand, DeleteUserCommand } from '../../application';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';

@UseGuards(BasicAuthGuard)
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
