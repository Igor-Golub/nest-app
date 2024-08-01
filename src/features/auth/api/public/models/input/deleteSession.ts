import { IsString } from 'class-validator';

export class DeleteSessionParams {
  @IsString()
  id: string;
}
