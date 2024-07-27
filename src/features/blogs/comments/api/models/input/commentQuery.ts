import { IsStringWithExpectedLength } from '../../../../../../common/decorators';

export class CommentsQuery {
  @IsStringWithExpectedLength(24, 24)
  id: string;
}
