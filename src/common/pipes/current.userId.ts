import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req?.user) {
      throw new Error('JwtGuard mast be used');
    }

    return req.user.toString();
  },
);
