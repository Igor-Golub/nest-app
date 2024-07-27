import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { CryptoService } from './infrastructure/services/crypto.service';
import {
  LocalStrategy,
  JwtStrategy,
  BasicStrategy,
} from './features/auth/strategies';
import {
  EmailIsExistConstraint,
  LoginIsExistConstraint,
  BlogIsExistConstraint,
} from './common/decorators';
import configuration from './settings/configuration';
import { AccessTokenExistMiddleware } from './common/middleware/isAccessTokenExist';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { TestingModule } from './features/testing/testing.module';
import { BlogsModule } from './features/blogs/blogs.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttle.ttl')!,
          limit: config.get('throttle.limit')!,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PassportModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get('db.mongoUri')!,
      }),
    }),
    UsersModule,
    AuthModule,
    TestingModule,
    BlogsModule,
  ],
  providers: [
    JwtService,
    CryptoService,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
    LoginIsExistConstraint,
    EmailIsExistConstraint,
    BlogIsExistConstraint,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenExistMiddleware)
      .forRoutes('blogs', 'posts', 'comments');
  }
}
