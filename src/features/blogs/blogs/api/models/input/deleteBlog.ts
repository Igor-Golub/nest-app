import { IsUUID } from 'class-validator';

export class DeleteBlogParams {
  @IsUUID()
  id: string;
}
