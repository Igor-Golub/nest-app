import { IsUUID } from 'class-validator';

export class CommentsQuery {
  @IsUUID()
  id: string;
}
