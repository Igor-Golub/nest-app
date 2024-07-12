import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();

    const exceptionData = exception.getResponse() as any;

    const errors: Base.ErrorResponse = {
      errorsMessages: exceptionData.message,
    };

    response.status(status).json(errors);
  }
}
