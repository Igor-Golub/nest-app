import { Request } from 'express';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CookiesService } from '../../../infrastructure/services/cookies.service';
import { DeleteSessionParams } from './models/input';
import { JwtCookieRefreshAuthGuard } from '../guards';
import { SessionRepo } from '../infrastructure/session.repo';
import { SessionViewModel } from './models/output';
import { SessionViewMapperManager } from './mappers';
import {
  DeleteSessionCommand,
  DeleteAllSessionsCommand,
} from '../application/sessions';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentSession } from '../../../common/pipes';
import { AuthService } from '../application/auth/auth.service';

@Controller('security')
@UseGuards(JwtCookieRefreshAuthGuard)
export class SessionController {
  constructor(
    private commandBus: CommandBus,
    private sessionRepo: SessionRepo,
    private cookiesService: CookiesService,
    private authService: AuthService,
  ) {}

  @Get('devices')
  public async getAllSessions(
    @CurrentSession() { id: userId }: Base.Session,
  ): Promise<SessionViewModel[]> {
    const sessions = await this.sessionRepo.findAllUserSessions(userId);

    return sessions.map(SessionViewMapperManager.mapSessionToView);
  }

  @Delete('devices')
  public async closeAllSessions(
    @Req() request: Request,
    @CurrentSession() { id: userId }: Base.Session,
  ): Promise<void> {
    const refreshToken = this.cookiesService.read(request, 'refreshToken');

    const { version } =
      this.authService.getSessionVersionAndExpirationDate(refreshToken);

    const command = new DeleteAllSessionsCommand({
      currentSessionId: version,
      userId,
    });

    await this.commandBus.execute(command);
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async closeSessionById(
    @Param() { id: deviceId }: DeleteSessionParams,
    @CurrentSession() { id: userId }: Base.Session,
  ): Promise<void> {
    const command = new DeleteSessionCommand({ userId, deviceId });

    await this.commandBus.execute(command);
  }
}
