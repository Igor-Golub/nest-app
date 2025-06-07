import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure';
import { BlogsRepository } from '../../blogs/blogs/infrastructure';
import { GameRepo } from '../../quizGame/infrastructure';

@Controller('testing')
export class TestingController {
  constructor(
    private userRepository: UsersRepository,
    private blogRepository: BlogsRepository,
    private gameRepository: GameRepo,
  ) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete() {
    try {
      await this.userRepository.drop();
      await this.blogRepository.drop();
      await this.gameRepository.drop();
    } catch (error) {
      console.error(error);
    }
  }
}
