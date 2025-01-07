import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SessionRepository } from '../../infrastructure/session.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async isSessionExist(refreshToken: string) {
    const { version } =
      this.authService.getSessionVersionAndExpirationDate(refreshToken);

    const session = await this.sessionRepository.findByField(
      'version',
      version,
    );

    if (!session.length) throw new UnauthorizedException();

    return { session: session[0] };
  }

  public async isSessionExistForDevice(deviceId: string) {
    const session = await this.sessionRepository.findByField(
      'deviceId',
      deviceId,
    );

    if (!session) throw new NotFoundException();

    return { session };
  }

  public async isSessionOfCurrentUser(userId: string, deviceId: string) {
    const session = await this.sessionRepository.findByField(
      'deviceId',
      deviceId,
    );

    if (!session) throw new ForbiddenException();

    return { session };
  }
}
