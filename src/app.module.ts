// import of this config module must be on the top of imports
import { configModule } from './config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { dbOptions } from './core/dbOptions';
import { AuthModule } from './features/auth';
import { UsersModule } from './features/users';
import { BlogsModule } from './features/blogs';
import { CoreConfig } from './core/core.config';
import { CoreModule } from './core/core.module';
import { TestingModule } from './features/testing';
import { CryptoService } from './infrastructure/services/crypto.service';
import {
  BlogIsExistConstraint,
  EmailIsExistConstraint,
  LoginIsExistConstraint,
} from './common/decorators';
import {
  AccessTokenExistMiddleware,
  LoggingMiddleware,
} from './common/middleware';

@Module({
  imports: [
    CoreModule,
    ThrottlerModule.forRootAsync({
      imports: [CoreModule],
      inject: [CoreConfig],
      useFactory: (coreConfig: CoreConfig) => [
        {
          ttl: coreConfig.throttleTTL,
          limit: coreConfig.throttleLimit,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [CoreModule],
      inject: [CoreConfig],
      useFactory: (coreConfig: CoreConfig) => ({
        logging: [coreConfig.postgresLoggingLevel],
        autoLoadEntities: true,
        ...dbOptions,
      }),
    }),
    UsersModule,
    AuthModule,
    TestingModule,
    BlogsModule,
    configModule,
  ],
  providers: [
    JwtService,
    CryptoService,
    BlogIsExistConstraint,
    EmailIsExistConstraint,
    LoginIsExistConstraint,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenExistMiddleware)
      .forRoutes('*')
      .apply(LoggingMiddleware)
      .forRoutes('*');
  }
}
