import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../../users/application';

@Controller('testing')
export class TestingController {
  constructor(private userService: UsersService) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete() {}
}
