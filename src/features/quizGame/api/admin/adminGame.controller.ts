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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { GameMapManager } from '../models/mappers';
import { BasicAuthGuard } from '../../../auth/guards';
import { QuestionQueryRepo } from '../../infrastructure';
import { PublishQuestionModel, QuestionParam, QuestionsQuery, CreateUpdateQuestionModel } from '../models/input';
import {
  DeleteQuestionCommand,
  CreateQuestionCommand,
  UpdateQuestionCommand,
  PublishQuestionCommand,
} from '../../application';
import { QuestionViewModel } from '../models/output';

@ApiTags('Admin Game')
@UseGuards(BasicAuthGuard)
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

  @ApiOperation({
    summary: 'Get question by ID',
    description: 'Returns a question with its text, correct answers, and metadata.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID of the question',
    example: 'f1a2b3c4-5678-90ab-cdef-1234567890ab',
  })
  @ApiOkResponse({
    description: 'Question found and returned successfully',
    type: QuestionViewModel,
  })
  @ApiNotFoundResponse({
    description: 'Question with specified ID was not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format (not a UUID)',
  })
  @Get('/questions/:id')
  public async getQuestion(@Param() { id }: QuestionParam) {
    const question = await this.questionQueryRepo.findById(id);

    return GameMapManager.mapToView(question!);
  }

  @Post('/questions')
  @HttpCode(HttpStatus.CREATED)
  public async createQuestion(@Body() createQuestionDto: CreateUpdateQuestionModel) {
    const command = new CreateQuestionCommand({
      body: createQuestionDto.body,
      correctAnswers: createQuestionDto.correctAnswers,
    });

    const questionId = await this.commandBus.execute<CreateQuestionCommand, string>(command);

    const question = await this.questionQueryRepo.findById(questionId);

    return GameMapManager.mapToView(question);
  }

  @Put('/questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updateQuestion(@Param() { id }: QuestionParam, @Body() updateQuestionDto: CreateUpdateQuestionModel) {
    const command = new UpdateQuestionCommand({
      questionId: id,
      ...updateQuestionDto,
    });

    return this.commandBus.execute<UpdateQuestionCommand, string>(command);
  }

  @Put('/questions/:id/publish')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async publishQuestion(@Param() { id }: QuestionParam, @Body() publishQuestionDto: PublishQuestionModel) {
    const command = new PublishQuestionCommand({
      questionId: id,
      publishStatus: publishQuestionDto.published,
    });

    return this.commandBus.execute<PublishQuestionCommand, string>(command);
  }

  @Delete('/questions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteQuestion(@Param() { id }: QuestionParam) {
    const command = new DeleteQuestionCommand({ questionId: id });

    await this.commandBus.execute(command);
  }
}
