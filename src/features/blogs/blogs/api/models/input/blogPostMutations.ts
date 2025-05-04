import {
  IsStringWithExpectedLength,
  Trim,
} from '../../../../../../common/decorators';
import { IsUUID } from 'class-validator';

export class CreateBlogPostParams {
  @IsUUID()
  blogId: string;
}

export class UpdateBlogPostParams {
  @IsUUID()
  blogId: string;

  @IsUUID()
  postId: string;
}

export class DeleteBlogPostParams {
  @IsUUID()
  blogId: string;

  @IsUUID()
  postId: string;
}

export class CreateBlogPostDto {
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

export class UpdateBlogPostDto {
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
