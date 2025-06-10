import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { DeleteSessionParams } from '../models/input';
import { JwtCookieRefreshAuthGuard } from '../../guards';
import { SessionViewMapperManager } from '../mappers';
import { DeleteAllSessionsCommand, DeleteSessionCommand } from '../../application/sessions';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentSession } from '../../../../common/pipes';
import { SessionService } from '../../application/sessions/session.service';
import { UsersService } from '../../../users/application';
import { SessionRepository } from '../../infrastructure/session.repository';
import { ApiTags } from '@nestjs/swagger';

enum SessionRoutes {
  Devices = 'devices',
  DeleteSessionByDeviceId = 'devices/:id',
}

@ApiTags('Sessions')
@Controller('security')
@UseGuards(JwtCookieRefreshAuthGuard)
export class SessionController {
  constructor(
    private commandBus: CommandBus,
    private sessionRepository: SessionRepository,
    private usersService: UsersService,
    private sessionService: SessionService,
  ) {}

  @Get(SessionRoutes.Devices)
  public async getAllSessions(@CurrentSession() { id: userId }: Base.Session) {
    const session = await this.sessionRepository.findByField('ownerId', userId);

    return session.map(SessionViewMapperManager.mapSessionToView);
  }

  @Delete(SessionRoutes.Devices)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async closeAllSessions(@CurrentSession() { id: userId, refreshToken }: Base.Session) {
    const session = await this.sessionService.isSessionExist(refreshToken);

    const command = new DeleteAllSessionsCommand({
      currentSessionVersion: session.version,
      ownerId: userId,
    });

    await this.commandBus.execute<DeleteAllSessionsCommand, boolean>(command);
  }

  @Delete(SessionRoutes.DeleteSessionByDeviceId)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async closeSessionById(
    @Param() { id: deviceId }: DeleteSessionParams,
    @CurrentSession() { id: userId }: Base.Session,
  ) {
    await this.usersService.isUserExist(userId);

    await this.sessionService.isSessionExistForDevice(deviceId);
    await this.sessionService.isSessionOfCurrentUser(userId, deviceId);

    const command = new DeleteSessionCommand({ ownerId: userId, deviceId });

    await this.commandBus.execute<DeleteSessionCommand, boolean>(command);
  }
}
