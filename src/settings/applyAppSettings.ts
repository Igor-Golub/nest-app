import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';
import { CoreConfig } from '../core/core.config';
import { DomainErrorFilter } from '../common/exceptionFilters/domain-error.filter';
import { HttpExceptionFilter } from '../common/exceptionFilters/http-exception.filter';
import { RepositoryErrorFilter } from '../common/exceptionFilters/repository-error.filter';

export function applyAppSettings(app: INestApplication) {
  const coreConfig = app.get(CoreConfig);

  app.enableCors();

  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // app.setGlobalPrefix(APP_PREFIX);

  if (coreConfig.isSwaggerEnabled) {
    const config = new DocumentBuilder().setTitle('API for bloggers platform').setVersion('1.0').build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, documentFactory);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorsData = errors.reduce<Base.HttpError[]>((acc, { property, constraints }) => {
          if (!constraints) return acc;

          const firstConstraintKey = Object.keys(constraints)[0];

          acc.push({
            field: property,
            message: constraints[firstConstraintKey],
          });

          return acc;
        }, []);

        throw new BadRequestException(errorsData);
      },
    }),
  );

  app.useGlobalFilters(new DomainErrorFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new RepositoryErrorFilter());
}
