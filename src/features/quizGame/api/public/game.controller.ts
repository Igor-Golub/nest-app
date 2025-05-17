import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/features/auth/guards";

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  @Get('pairs/my-current')
  async getGame() {
    return 'Hello World';
  }

  @Get('pairs/:id')
  async gamePairs(@Param('id') id: string) {
    return 'Hello World';
  }

  @Post('pairs/connection')
  async connectToGame() {
    return 'Hello World';
  }

  @Post('pairs/my-current/answer')
  async answerGame() {
    return 'Hello World';
  }
}