import { IsString } from 'class-validator';
import {
  BlogIsExist,
  IsStringWithExpectedLength,
  Trim,
} from '../../../../../common/decorators';

export class CreatePostDto {
  @Trim()
  @IsStringWithExpectedLength(1, 30)
  title: string;

  @Trim()
  @IsStringWithExpectedLength(1, 100)
  content: string;

  @IsString()
  @BlogIsExist()
  blogId: string;

  @Trim()
  @IsStringWithExpectedLength(1, 100)
  shortDescription: string;
}
