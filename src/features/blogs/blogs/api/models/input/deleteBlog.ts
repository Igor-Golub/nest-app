import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class DeleteBlogParams {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
