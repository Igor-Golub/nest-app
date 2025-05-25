import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentDevice = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<Request>();

  return {
    deviceIp: req.ip ?? 'Not found',
    deviceName: req.headers['user-agent'] ?? 'Not found',
  };
});
