import { IsStringWithExpectedLength } from '@app/common/decorators';

export class DeleteBlogParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
