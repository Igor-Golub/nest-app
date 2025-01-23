import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure';

@Controller('testing')
export class TestingController {
  constructor(private userRepository: UsersRepository) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete() {
    try {
      await this.userRepository.drop();
    } catch (error) {
      console.error(error);
    }
  }
}
