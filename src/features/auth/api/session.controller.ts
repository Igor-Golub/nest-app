import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DeleteSessionParams } from './models/input';
import { JwtCookieRefreshAuthGuard } from '../guards';
import { SessionRepo } from '../infrastructure/session.repo';
import { SessionViewModel } from './models/output';
import { SessionViewMapperManager } from './mappers';
import {
  DeleteAllSessionsCommand,
  DeleteSessionCommand,
} from '../application/sessions';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentSession } from '../../../common/pipes';
import { SessionService } from '../application/sessions/session.service';
import { UsersService } from '../../users/application/users.service';

enum SessionRoutes {
  Devices = 'devices',
  DeleteSessionByDeviceId = 'devices/:id',
}

@Controller('security')
@UseGuards(JwtCookieRefreshAuthGuard)
export class SessionController {
  constructor(
    private commandBus: CommandBus,
    private sessionRepo: SessionRepo,
    private usersService: UsersService,
    private sessionService: SessionService,
  ) {}

  @Get(SessionRoutes.Devices)
  public async getAllSessions(
    @CurrentSession() { id: userId }: Base.Session,
  ): Promise<SessionViewModel[]> {
    const sessions = await this.sessionRepo.findAllUserSessions(userId);

    return sessions.map(SessionViewMapperManager.mapSessionToView);
  }

  @Delete(SessionRoutes.Devices)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async closeAllSessions(
    @CurrentSession() { id: userId, refreshToken }: Base.Session,
  ): Promise<void> {
    const { session } = await this.sessionService.isSessionExist(refreshToken);

    const command = new DeleteAllSessionsCommand({
      currentSessionId: session._id.toString(),
      userId,
    });

    await this.commandBus.execute(command);
  }

  @Delete(SessionRoutes.DeleteSessionByDeviceId)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async closeSessionById(
    @Param() { id: deviceId }: DeleteSessionParams,
    @CurrentSession() { id: userId }: Base.Session,
  ): Promise<void> {
    await this.usersService.isUserExist(userId);

    await this.sessionService.isSessionExistForDevice(deviceId);
    await this.sessionService.isSessionOfCurrentUser(userId, deviceId);

    const command = new DeleteSessionCommand({ userId, deviceId });

    await this.commandBus.execute(command);
  }
}
