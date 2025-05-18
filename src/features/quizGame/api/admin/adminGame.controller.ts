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
  NotFoundException,
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
  PublishQuestionCommand,
  UpdateQuestionCommand,
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

    await this.checkQuestionExisting(question?.id);

    return QuestionMapManager.mapToView(question!);
  }

  @Post('/questions')
  public async createQuestion(
    @Param() { id }: QuestionParam,
    @Body() createQuestionDto: CreateUpdateQuestionModel,
  ) {
    await this.checkQuestionExisting(id);

    const command = new CreateQuestionCommand();

    return '';
  }

  @Put('/questions/:id')
  public async updateQuestion(
    @Param() { id }: QuestionParam,
    @Body() updateQuestionDto: CreateUpdateQuestionModel,
  ) {
    await this.checkQuestionExisting(id);

    const command = new UpdateQuestionCommand();

    return '';
  }

  @Put('/questions/:id')
  public async publishQuestion(
    @Param() { id }: QuestionParam,
    @Body() publishQuestionDto: PublishQuestionModel,
  ) {
    await this.checkQuestionExisting(id);

    const command = new PublishQuestionCommand();

    return '';
  }

  @Delete('/questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteQuestion(@Param() { id }: QuestionParam) {
    await this.checkQuestionExisting(id);

    const command = new DeleteQuestionCommand({ questionId: id });

    await this.commandBus.execute(command);
  }

  private async checkQuestionExisting(id: string | undefined) {
    if (!id) throw new NotFoundException();

    const question = await this.questionQueryRepo.findById(id);

    if (!question) throw new NotFoundException();

    return question;
  }
}
