import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../common/exceptionFilters/http-exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

export function applyAppSettings(app: INestApplication) {
  app.enableCors();

  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // app.setGlobalPrefix(APP_PREFIX);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
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
