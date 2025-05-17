import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  UseGuards,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../../auth/guards';
import {
  CreateQuestionModel,
  PublishQuestionModel,
  QuestionParam,
  QuestionsQuery,
  UpdateQuestionModel,
} from '../models/input';

@UseGuards(BasicAuthGuard)
@Controller('sa/quiz')
export class AdminBlogsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('/questions')
  public async getQuestions(@Query() params: QuestionsQuery) {
    return '';
  }

  @Get('/questions/:id')
  public async getQuestion(@Param() { id }: QuestionParam) {
    return '';
  }

  @Post('/questions')
  public async createQuestion(
    @Param() { id }: QuestionParam,
    @Body() createQuestionDto: CreateQuestionModel,
  ) {
    return '';
  }

  @Put('/questions/:id')
  public async updateQuestion(
    @Param() { id }: QuestionParam,
    @Body() updateQuestionDto: UpdateQuestionModel,
  ) {
    return '';
  }

  @Put('/questions/:id')
  public async publishQuestion(
    @Param() { id }: QuestionParam,
    @Body() publishQuestionDto: PublishQuestionModel,
  ) {
    return '';
  }

  @Delete('/questions/:id')
  public async deleteQuestion(@Param() { id }: QuestionParam) {
    return '';
  }
}
