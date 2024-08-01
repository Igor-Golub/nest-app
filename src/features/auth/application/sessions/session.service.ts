import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionMongoRepo } from '../../infrastructure/mongo/session.mongo.repo';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionRepo: SessionMongoRepo,
  ) {}

  public async isSessionExist(refreshToken: string) {
    const { version } =
      this.authService.getSessionVersionAndExpirationDate(refreshToken);

    const session = await this.sessionRepo.findSession({
      version,
    });

    if (!session) throw new UnauthorizedException();

    return { session };
  }

  public async isSessionExistForDevice(deviceId: string) {
    const session = await this.sessionRepo.findSession({
      deviceId,
    });

    if (!session) throw new NotFoundException();

    return { session };
  }

  public async isSessionOfCurrentUser(userId: string, deviceId: string) {
    const session = await this.sessionRepo.findSession({
      userId,
      deviceId,
    });

    if (!session) throw new ForbiddenException();

    return { session };
  }
}
