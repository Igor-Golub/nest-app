import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserIdFromAccessToken = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();

  return req?.user?.id;
});
