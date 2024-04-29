import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getAll() {}

  @Post()
  create(@Body() createUserDto: ApiDTO.UserCreate) {}

  @Delete()
  delete(@Param('id') id: string) {}
}
