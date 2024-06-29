import { IsUrl, Matches } from 'class-validator';
import {
  IsStringWithExpectedLength,
  Trim,
} from '../../../../../common/decorators';

export class UpdateBlogParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}

export class UpdateBlogDto {
  @Trim()
  @IsStringWithExpectedLength(1, 15)
  name: string;

  @IsStringWithExpectedLength(1, 500)
  description: string;

  @IsStringWithExpectedLength(1, 100)
  @IsUrl()
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  websiteUrl: string;
}
