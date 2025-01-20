import {
  IsStringWithExpectedLength,
  Trim,
} from '../../../../../../common/decorators';
import { IsUUID } from 'class-validator';

export class CreatePostForBlogParams {
  @IsUUID()
  id: string;
}

export class CreatePostForBlogDto {
  @Trim()
  @IsStringWithExpectedLength(1, 30)
  title: string;

  @Trim()
  @IsStringWithExpectedLength(1, 100)
  shortDescription: string;

  @Trim()
  @IsStringWithExpectedLength(1, 1000)
  content: string;
}
