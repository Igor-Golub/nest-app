// import of this config module must be on the top of imports
import { configModule } from './config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoService } from './infrastructure/services/crypto.service';
import {
  BasicStrategy,
  CookieRefreshTokenStrategy,
  JwtStrategy,
  LocalStrategy,
} from './features/auth/strategies';
import {
  BlogIsExistConstraint,
  EmailIsExistConstraint,
  LoginIsExistConstraint,
} from './common/decorators';
import { AccessTokenExistMiddleware } from './common/middleware';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { TestingModule } from './features/testing/testing.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreConfig } from './core/core.config';
import { CoreModule } from './core/core.module';

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
        type: 'postgres',
        host: coreConfig.host,
        port: coreConfig.dbPort,
        username: coreConfig.user,
        password: coreConfig.pass,
        database: coreConfig.name,
        autoLoadEntities: false,
        synchronize: false,
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [CoreModule],
      inject: [CoreConfig],
      useFactory: (coreConfig: CoreConfig) => ({
        uri: coreConfig.mongoURI,
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
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
    BlogIsExistConstraint,
    EmailIsExistConstraint,
    LoginIsExistConstraint,
    CookieRefreshTokenStrategy,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenExistMiddleware)
      .forRoutes('blogs', 'posts', 'comments');
  }
}
