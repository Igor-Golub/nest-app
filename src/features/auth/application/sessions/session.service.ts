import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SessionRepo } from '../../infrastructure';

@Injectable()
export class SessionService {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionRepo: SessionRepo,
  ) {}

  public async isSessionExist(refreshToken: string) {
    const { version } =
      this.authService.getSessionVersionAndExpirationDate(refreshToken);

    const session = await this.sessionRepo.findByField('version', version);

    if (!session.length) throw new UnauthorizedException();

    return { session: session[0] };
  }

  public async isSessionExistForDevice(deviceId: string) {
    const session = await this.sessionRepo.findByField('deviceId', deviceId);

    if (!session) throw new NotFoundException();

    return { session };
  }

  public async isSessionOfCurrentUser(userId: string, deviceId: string) {
    const session = await this.sessionRepo.findByField('deviceId', deviceId);

    if (!session) throw new ForbiddenException();

    return { session };
  }
}
