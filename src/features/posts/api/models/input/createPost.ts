import { IsString } from 'class-validator';
import {
  IsStringWithExpectedLength,
  Trim,
} from '../../../../../common/decorators';

export class CreatePostDto {
  @Trim()
  @IsStringWithExpectedLength(0, 30)
  title: string;

  @Trim()
  @IsStringWithExpectedLength(0, 100)
  content: string;

  @IsString()
  blogId: string;

  @Trim()
  @IsStringWithExpectedLength(0, 100)
  shortDescription: string;
}
