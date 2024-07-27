import { IsUUID } from 'class-validator';

export class DeleteSessionParams {
  @IsUUID()
  id: string;
}
