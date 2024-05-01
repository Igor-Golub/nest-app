import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public async getAll(@Query() query: Api.UsersQuery) {
    return this.usersService.findWithPagination();
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.crete(createUserDto);
  }

  @Delete('id')
  public async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
