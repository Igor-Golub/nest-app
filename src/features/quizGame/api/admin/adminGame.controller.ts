import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { QuestionQueryRepo } from '../../infrastructure';
import {
  PublishQuestionModel,
  QuestionParam,
  QuestionsQuery,
  CreateUpdateQuestionModel,
} from '../models/input';
import { QuestionMapManager } from '../models/mappers';
import {
  DeleteQuestionCommand,
  CreateQuestionCommand,
  UpdateQuestionCommand,
  PublishQuestionCommand,
} from '../../application';

@Controller('sa/quiz')
export class AdminQuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly questionQueryRepo: QuestionQueryRepo,
  ) {}

  @Get('/questions')
  public async getQuestions(@Query() params: QuestionsQuery) {
    return this.questionQueryRepo.findWithPagination(params);
  }

  @Get('/questions/:id')
  public async getQuestion(@Param() { id }: QuestionParam) {
    const question = await this.questionQueryRepo.findById(id);

    return QuestionMapManager.mapToView(question!);
  }

  @Post('/questions')
  @HttpCode(HttpStatus.CREATED)
  public async createQuestion(
    @Body() createQuestionDto: CreateUpdateQuestionModel,
  ) {
    const command = new CreateQuestionCommand({
      body: createQuestionDto.body,
      correctAnswers: createQuestionDto.correctAnswers,
    });

    const questionId = await this.commandBus.execute<
      CreateQuestionCommand,
      string
    >(command);

    return this.questionQueryRepo.findById(questionId);
  }

  @Put('/questions/:id')
  public async updateQuestion(
    @Param() { id }: QuestionParam,
    @Body() updateQuestionDto: CreateUpdateQuestionModel,
  ) {
    const command = new UpdateQuestionCommand({
      questionId: id,
      ...updateQuestionDto,
    });

    const questionId = await this.commandBus.execute<
      UpdateQuestionCommand,
      string
    >(command);

    return this.questionQueryRepo.findById(questionId);
  }

  @Put('/questions/:id/publish')
  public async publishQuestion(
    @Param() { id }: QuestionParam,
    @Body() publishQuestionDto: PublishQuestionModel,
  ) {
    const command = new PublishQuestionCommand({
      questionId: id,
      publishStatus: publishQuestionDto.published,
    });

    const questionId = await this.commandBus.execute<
      PublishQuestionCommand,
      string
    >(command);

    return this.questionQueryRepo.findById(questionId);
  }

  @Delete('/questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteQuestion(@Param() { id }: QuestionParam) {
    const command = new DeleteQuestionCommand({ questionId: id });

    await this.commandBus.execute(command);
  }
}
