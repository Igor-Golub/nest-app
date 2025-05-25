import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { RepositoryError } from '../../core/errors/RepositoryError';

@Catch(RepositoryError)
export class RepositoryErrorFilter implements ExceptionFilter {
  catch(exception: RepositoryError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(404).json({
      errorsMessages: [exception.message],
    });
  }
}
