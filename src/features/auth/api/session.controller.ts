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
import { CurrentUserId } from '../../../common/pipes/current.userId';
import { SessionRepo } from '../infrastructure/session.repo';
import { SessionViewModel } from './models/output';
import { SessionViewMapperManager } from './mappers';
import {
  DeleteSessionCommand,
  DeleteAllSessionsCommand,
} from '../application/sessions';
import { CommandBus } from '@nestjs/cqrs';

@Controller('security')
@UseGuards(JwtCookieRefreshAuthGuard)
export class SessionController {
  constructor(
    private commandBus: CommandBus,
    private sessionRepo: SessionRepo,
    private cookiesService: CookiesService,
  ) {}

  @Get('devices')
  public async getAllSessions(
    @CurrentUserId() currentUserId: string,
  ): Promise<SessionViewModel[]> {
    const sessions = await this.sessionRepo.findAllUserSessions(currentUserId);

    return sessions.map(SessionViewMapperManager.mapSessionToView);
  }

  @Delete('devices')
  public async closeAllSessions(
    @Req() request: Request,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const refreshToken = this.cookiesService.read(request, 'refreshToken');

    const command = new DeleteAllSessionsCommand({
      currentSessionId: '',
      userId,
    });

    await this.commandBus.execute(command);
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async closeSessionById(
    @Param() { id: deviceId }: DeleteSessionParams,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    const command = new DeleteSessionCommand({ userId, deviceId });

    await this.commandBus.execute(command);
  }
}
