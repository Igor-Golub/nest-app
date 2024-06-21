import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../common/exceptionFilters/http-exception.filter';

export function applyAppSettings(app: INestApplication) {
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsData = errors.reduce<Base.HttpError[]>(
          (acc, { property, constraints }) => {
            if (!constraints) return acc;

            const firstConstraintKey = Object.keys(constraints)[0];

            acc.push({
              field: property,
              message: constraints[firstConstraintKey],
            });

            return acc;
          },
          [],
        );

        throw new BadRequestException(errorsData);
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
}
