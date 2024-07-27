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

@Controller('security')
@UseGuards(JwtCookieRefreshAuthGuard)
export class SessionController {
  constructor(
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
  public closeAllSessions(@Req() request: Request) {
    const refreshToken = this.cookiesService.read(request, 'refreshToken');
  }

  @Delete('devices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public closeSessionById(@Param() { id }: DeleteSessionParams) {}
}
