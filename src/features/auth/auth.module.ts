import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import {
  ConfirmPasswordRecoveryHandler,
  ConfirmRegistrationHandler,
  LoginHandler,
  PasswordRecoveryHandler,
  RegisterHandler,
  ResendConfirmationHandler,
} from './application';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenHandler } from './application/refreshToken.useCase';
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
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: RecoveryModel.name,
        schema: RecoverySchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: config.get('auth.jwtExpireTime') },
      }),
    }),
  ],
  providers: [
    AuthService,
    SmtpService,
    RecoveryRepo,
    LoginHandler,
    EmailService,
    NotifyManager,
    CryptoService,
    CookiesService,
    RegisterHandler,
    RefreshTokenHandler,
    PasswordRecoveryHandler,
    ResendConfirmationHandler,
    ConfirmRegistrationHandler,
    EmailTemplatesCreatorService,
    ConfirmPasswordRecoveryHandler,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
