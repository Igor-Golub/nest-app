import { IsString } from 'class-validator';
import { Trim } from '@app/common/decorators/transform/trim';
import { IsStringWithExpectedLength } from '@app/common/decorators';

export class UpdatePostDto {
  @Trim()
  @IsStringWithExpectedLength(0, 30)
  title: string;

  @IsStringWithExpectedLength(0, 100)
  content: string;

  @IsString()
  blogId: string;

  @IsStringWithExpectedLength(0, 1000)
  shortDescription: string;
}
