import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentSession = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();

    if (!req?.user) {
      throw new Error('JwtRefreshGuard mast be used');
    }

    return req.user;
  },
);
