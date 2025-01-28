import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure';
import { BlogsRepository } from '../../blogs/blogs/infrastructure';

@Controller('testing')
export class TestingController {
  constructor(
    private userRepository: UsersRepository,
    private blogRepository: BlogsRepository,
  ) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete() {
    try {
      await this.userRepository.drop();
      await this.blogRepository.drop();
    } catch (error) {
      console.error(error);
    }
  }
}
