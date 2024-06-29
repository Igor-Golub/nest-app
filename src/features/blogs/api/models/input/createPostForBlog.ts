import { IsStringWithExpectedLength, Trim } from '@app/common/decorators';

export class CreatePostForBlogParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}

export class CreatePostForBlogDto {
  @Trim()
  @IsStringWithExpectedLength(1, 30)
  title: string;

  @IsStringWithExpectedLength(1, 100)
  shortDescription: string;

  @IsStringWithExpectedLength(1, 1000)
  content: string;
}
