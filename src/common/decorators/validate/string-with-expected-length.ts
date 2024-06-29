import { applyDecorators } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export const IsStringWithExpectedLength = (min: number, max: number) => {
  return applyDecorators(IsString(), Length(min, max));
};
