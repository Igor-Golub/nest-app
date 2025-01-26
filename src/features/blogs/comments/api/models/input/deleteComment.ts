import { IsUUID } from 'class-validator';

export class DeleteCommentParams {
  @IsUUID()
  id: string;
}
