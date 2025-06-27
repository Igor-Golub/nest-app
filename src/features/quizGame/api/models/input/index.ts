import { ArrayMinSize, ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PublishedStatus } from '../../../infrastructure/enums';
import { QueryParams } from '../../../../../common/decorators/validate';
import { IsStringWithExpectedLength, Trim } from '../../../../../common/decorators';

export class PairParam {
  @IsUUID()
  id: string;
}

export class QuestionParam {
  @IsUUID()
  id: string;
}

export class QuestionsQuery extends QueryParams {
  @IsString()
  @IsOptional()
  bodySearchTerm: string | null = null;

  @IsEnum(PublishedStatus)
  @IsOptional()
  publishedStatus: PublishedStatus = PublishedStatus.All;
}

export class CreateUpdateQuestionModel {
  @Trim()
  @IsStringWithExpectedLength(10, 500)
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  correctAnswers: string[];
}

export class PublishQuestionModel {
  @IsBoolean()
  published: boolean;
}

export class AnswerModel {
  @IsString()
  answer: string;
}
