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
import { UsersQueryDto, CreateUserDto } from './models/input';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { FiltersType } from '../../../common/enums';
import { BasicAuthGuard } from '../../auth/guards';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand, DeleteUserCommand } from '../application';
import { DeleteUserParams } from './models/input';
import { UsersQueryRepo } from '../infrastructure';
import { UserViewMapperManager } from './mappers';

@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepo: UsersQueryRepo,
    private readonly paginationService: PaginationService,
    private readonly sortingService: ClientSortingService,
    private readonly filterService: ClientFilterService<ViewModels.Blog>,
  ) {}

  @Get()
  public async getAll(@Query() query: UsersQueryDto) {
    const {
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
      pageSize,
      pageNumber,
    } = query;

    this.paginationService.setValues({ pageSize, pageNumber });
    this.sortingService.setValue(sortBy, sortDirection);
    this.filterService.setValues(
      {
        login: searchLoginTerm,
        email: searchEmailTerm,
      },
      FiltersType.OrAndInnerText,
    );

    const result = await this.usersQueryRepo.findWithPagination();

    return {
      ...result,
      items: UserViewMapperManager.mapUsersToView([]),
    };
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
