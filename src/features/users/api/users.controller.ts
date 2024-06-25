import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './models/input/createUserDto';
import { UsersService } from '../application/users.service';
import { UsersQueryRepo } from '../infrastructure/users.query.repo';
import { PaginationService } from '../../../infrastructure/services/pagination.service';
import { ClientSortingService } from '../../../infrastructure/services/clientSorting.service';
import { ClientFilterService } from '../../../infrastructure/services/filter.service';
import { FiltersType } from '../../../common/enums/Filters';
// import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';

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
  public async getAll(@Query() query: Api.UsersQuery) {
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

  // @UseGuards(BasicAuthGuard)
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
