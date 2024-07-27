import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CryptoService } from '../../../infrastructure/services/crypto.service';
import { SessionRepo } from '../infrastructure/session.repo';

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
    private jwtService: JwtService,
    private sessionRepo: SessionRepo,
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

    const pairTokens = await this.generatePairTokens(userData.id, deviceId);

    const decodeResult = this.jwtService.decode(pairTokens.refresh);

    await this.sessionRepo.createSession({
      deviceId,
      userId: userData.id,
      deviceIp: deviceData.ip,
      deviceName: deviceData.name,
      version: new Date(decodeResult.iat * 1000).toISOString(),
      expirationDate: new Date(Number(decodeResult.exp) * 1000),
    });

    return pairTokens;
  }

  private async generatePairTokens(userId: string, deviceId: string) {
    const refresh = await this.jwtService.signAsync({
      userId,
      deviceId,
      // tokenKey: '' ????
    });

    const access = await this.jwtService.signAsync({ userId });

    return { access, refresh };
  }
}
