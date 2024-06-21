import { IsString, IsUUID } from 'class-validator';

export class ConfirmRegistrationDto {
  @IsString()
  @IsUUID()
  code: string;
}
