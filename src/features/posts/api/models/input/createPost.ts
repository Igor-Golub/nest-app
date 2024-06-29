import { IsString } from 'class-validator';
import {
  IsStringWithExpectedLength,
  Trim,
} from '../../../../../common/decorators';

export class CreatePostDto {
  @Trim()
  @IsStringWithExpectedLength(0, 30)
  title: string;

  @IsStringWithExpectedLength(0, 100)
  content: string;

  @IsString()
  blogId: string;

  @IsStringWithExpectedLength(0, 1000)
  shortDescription: string;
}
