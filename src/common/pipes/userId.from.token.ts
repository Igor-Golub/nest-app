import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserIdFromAccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    return req?.context?.userId ?? undefined;
  },
);
