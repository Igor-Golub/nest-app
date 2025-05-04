import { IsUUID } from 'class-validator';

export class DeleteBlogParams {
  @IsUUID()
  blogId: string;
}
