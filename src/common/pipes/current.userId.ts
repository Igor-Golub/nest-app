import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    if (!req?.user?.id) {
      throw new Error('JwtGuard mast be used');
    }

    return req.user.id;
  },
);
