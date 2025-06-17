import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { RepositoryError } from '../../core/errors';

@Catch(RepositoryError)
export class RepositoryErrorFilter implements ExceptionFilter {
  catch(exception: RepositoryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.httpStatus).json({
      errorsMessages: [exception.message],
    });
  }
}
