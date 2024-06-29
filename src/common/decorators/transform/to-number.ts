import { Transform, TransformFnParams } from 'class-transformer';

export const ToNumber = (defaultValue?: number) => {
  return Transform(({ value }: TransformFnParams) => {
    if (value) {
      return Number(value);
    }

    return defaultValue ?? null;
  });
};
