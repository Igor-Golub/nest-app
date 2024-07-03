import { Injectable } from '@nestjs/common';

// TODO:(class) add interlayer manager
@Injectable()
export class AuthService {
  constructor() {}

  public async logout(refreshToken: string) {}
}
