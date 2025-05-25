import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './api/public/auth.controller';
import { AuthService } from './application/auth/auth.service';
import {
  ConfirmPasswordRecoveryHandler,
  ConfirmRegistrationHandler,
  LoginHandler,
  PasswordRecoveryHandler,
  RegisterHandler,
  ResendConfirmationHandler,
  LogoutCommandHandler,
} from './application/auth';
import { RefreshTokenHandler } from './application/auth/refreshToken.useCase';
import { CookiesService } from '../../infrastructure/services/cookies.service';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { UsersModule } from '../users/users.module';
import { NotifyManager } from '../../infrastructure/managers/notify.manager';
import { EmailService } from '../../infrastructure/managers/email.service';
import { SmtpService } from '../../infrastructure/managers/smtp.service';
import { EmailTemplatesCreatorService } from '../../infrastructure/managers/emailTemplatesCreator.service';
import { SessionController } from './api/public/session.controller';
import { DeleteAllSessionsCommandHandler, DeleteSessionCommandHandler } from './application/sessions';
import { SessionService } from './application/sessions/session.service';
import { AuthConfig } from './config/auth.config';
import { AuthConfigModule } from './config/config.module';
import { SessionRepository } from './infrastructure/session.repository';
import { RecoveryRepository } from './infrastructure/recovery.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './domain/session.entity';
import { Recovery } from './domain/recovery.entity';
import { BasicStrategy, CookieRefreshTokenStrategy, JwtStrategy, LocalStrategy } from './strategies';

const authHandlers = [
  LoginHandler,
  RegisterHandler,
  RefreshTokenHandler,
  LogoutCommandHandler,
  PasswordRecoveryHandler,
  ResendConfirmationHandler,
  ConfirmRegistrationHandler,
  ConfirmPasswordRecoveryHandler,
];

const sessionHandlers = [DeleteSessionCommandHandler, DeleteAllSessionsCommandHandler];

@Module({
  imports: [
    AuthConfigModule,
    CqrsModule,
    PassportModule,
    UsersModule,
    TypeOrmModule.forFeature([Session, Recovery]),
    JwtModule.registerAsync({
      imports: [AuthConfigModule],
      inject: [AuthConfig],
      useFactory: (authConfig: AuthConfig) => ({
        secret: authConfig.jwtSecret,
        signOptions: { expiresIn: authConfig.jwtExpireTime },
      }),
    }),
  ],
  providers: [
    SessionRepository,
    SessionService,
    AuthService,
    SmtpService,
    RecoveryRepository,
    EmailService,
    NotifyManager,
    CryptoService,
    CookiesService,
    EmailTemplatesCreatorService,
    LocalStrategy,
    JwtStrategy,
    CookieRefreshTokenStrategy,
    BasicStrategy,
    ...authHandlers,
    ...sessionHandlers,
  ],
  controllers: [AuthController, SessionController],
  exports: [AuthService, SessionRepository],
})
export class AuthModule {}
