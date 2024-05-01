import { Controller, Delete } from '@nestjs/common';

@Controller('users')
export class TestingController {
  @Delete()
  delete() {

  }
}
