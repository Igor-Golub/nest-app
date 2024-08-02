import { IsString } from 'class-validator';

export class DeleteUserParams {
  @IsString()
  id: string;
}
