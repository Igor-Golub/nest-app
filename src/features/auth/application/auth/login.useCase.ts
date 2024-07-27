import { v4 as uuidv4 } from 'uuid';
import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CryptoService } from '../../../../infrastructure/services/crypto.service';
import { SessionRepo } from '../../infrastructure/session.repo';
import { AuthService } from './auth.service';

interface LoginCommandUserData {
  id: string;
  hash: string;
  password: string;
}
interface LoginCommandDeviceData {
  ip: string;
  name: string;
}

interface LoginCommandDto {
  userData: LoginCommandUserData;
  deviceData: LoginCommandDeviceData;
}

export class LoginCommand {
  constructor(readonly payload: LoginCommandDto) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private sessionRepo: SessionRepo,
    private authService: AuthService,
    private cryptoService: CryptoService,
  ) {}

  public async execute({ payload }: LoginCommand) {
    const { userData, deviceData } = payload;

    const compareResult = this.cryptoService.compareCredential(
      userData.password,
      userData.hash,
    );

    // TODO should use interlayer manager
    if (!compareResult) throw new UnauthorizedException();

    const deviceId = uuidv4();

    const pairTokens = await this.authService.generateTokens(
      userData.id,
      deviceId,
    );

    const { version, expirationDate } =
      this.authService.getSessionVersionAndExpirationDate(pairTokens.refresh);

    await this.sessionRepo.createSession({
      version,
      deviceId,
      expirationDate,
      userId: userData.id,
      deviceIp: deviceData.ip,
      deviceName: deviceData.name,
    });

    return pairTokens;
  }
}
