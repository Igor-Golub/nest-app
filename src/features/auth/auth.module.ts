import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './api/auth.controller';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenHandler } from './application/auth/refreshToken.useCase';
import { CookiesService } from '../../infrastructure/services/cookies.service';
import { CryptoService } from '../../infrastructure/services/crypto.service';
import { UsersModule } from '../users/users.module';
import { NotifyManager } from '../../infrastructure/managers/notify.manager';
import { EmailService } from '../../infrastructure/managers/email.service';
import { SmtpService } from '../../infrastructure/managers/smtp.service';
import { EmailTemplatesCreatorService } from '../../infrastructure/managers/emailTemplatesCreator.service';
import { RecoveryRepo } from './infrastructure/recovery.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { RecoveryModel, RecoverySchema } from './domain/recoveryEntity';
import { SessionModel, SessionSchema } from './domain/sessionEntity';
import { SessionController } from './api/session.controller';
import { SessionRepo } from './infrastructure/session.repo';
import {
  DeleteAllSessionsCommandHandler,
  DeleteSessionCommandHandler,
} from './application/sessions';

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

const sessionHandlers = [
  DeleteSessionCommandHandler,
  DeleteAllSessionsCommandHandler,
];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: RecoveryModel.name, schema: RecoverySchema },
      { name: SessionModel.name, schema: SessionSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('auth.jwtSecret'),
        signOptions: { expiresIn: configService.get('auth.jwtExpireTime') },
      }),
    }),
  ],
  providers: [
    SessionRepo,
    AuthService,
    SmtpService,
    RecoveryRepo,
    EmailService,
    NotifyManager,
    CryptoService,
    CookiesService,
    EmailTemplatesCreatorService,
    ...authHandlers,
    ...sessionHandlers,
  ],
  controllers: [AuthController, SessionController],
  exports: [AuthService, SessionRepo],
})
export class AuthModule {}
