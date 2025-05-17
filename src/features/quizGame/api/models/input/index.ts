import {
  IsUUID,
  ArrayUnique,
  ArrayNotEmpty,
  IsBoolean,
  IsArray,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import {
  IsStringWithExpectedLength,
  Trim,
} from '../../../../../common/decorators';
import { PublishedStatus } from '../../../infrastructure';
import { QueryParams } from '../../../../../common/decorators/validate';

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
  @ArrayUnique()
  @IsString({ each: true })
  correctAnswers: string[];
}

export class PublishQuestionModel {
  @IsBoolean()
  published: boolean;
}
