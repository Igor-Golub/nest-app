import {
  IsEnum,
  IsUUID,
  IsArray,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  ArrayMinSize,
  ArrayNotEmpty,
  ValidateIf,
  Matches,
} from 'class-validator';
import { PublishedStatus } from '../../../infrastructure/enums';
import { QueryParams } from '../../../../../common/decorators/validate';
import { IsStringWithExpectedLength, ToNumber, Trim } from '../../../../../common/decorators';

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

export class UsersTopQueryParams {
  @IsOptional()
  @IsArray()
  @ValidateIf((_, value) => Array.isArray(value))
  sort: string[] = [];

  @ToNumber(10)
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;

  @ToNumber(1)
  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;
}
