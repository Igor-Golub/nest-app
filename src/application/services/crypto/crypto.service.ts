import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  public async createSaltAndHash(password: string) {
    const salt = await this.createSalt();
    const hash = await this.createHash(password, salt);

    return { salt, hash };
  }

  public compareCredential(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  private async createSalt() {
    return bcrypt.genSalt(10);
  }

  public async createHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
