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
import { UserViewModel } from '../models/output';
import { DeleteUserParams } from '../models/input';
import { JwtAuthGuard } from '../../../auth/guards';
import { UsersQueryRepository } from '../../infrastructure';
import { GetUsersQueryParams, CreateUserDto } from '../models/input';
import { CreateUserCommand, DeleteUserCommand } from '../../application';
import { PaginatedViewDto } from '../../../../common/dto/base.paginated.view-dto';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepository,
  ) {}

  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a paginated list of users with optional filtering and sorting',
  })
  @ApiOkResponse({
    description: 'Users retrieved successfully',
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Get()
  public async getAll(@Query() query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewModel[]>> {
    return this.usersQueryRepo.findWithPagination(query);
  }

  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new user account with unique login and email',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(createUserDto);

    return this.commandBus.execute<CreateUserCommand, string>(command);
  }

  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user by their ID',
  })
  @ApiNoContentResponse({
    description: 'Successfully deleted user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param() { id }: DeleteUserParams) {
    const command = new DeleteUserCommand({ id });

    const result = await this.commandBus.execute<DeleteUserCommand, boolean>(command);

    if (!result) throw new NotFoundException();
  }
}
