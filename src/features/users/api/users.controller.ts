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
import { UsersService } from '../application/users.service';
import { UsersQueryRepo } from '../infrastructure/users.query.repo';
import { DeleteUserDto, UsersQueryDto, CreateUserDto } from './models/input';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { FiltersType } from '../../../common/enums';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
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

    return this.usersQueryRepo.getWithPagination();
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param() { id }: DeleteUserDto) {
    const result = await this.usersService.delete(id);

    if (!result) throw new NotFoundException();

    return true;
  }
}
