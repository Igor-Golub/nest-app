import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreEnvUtils {
  public static convertToBoolean(value: string | undefined) {
    switch (value) {
      case 'true':
      case '1':
      case 'enabled':
        return true;
      case 'false':
      case '0':
      case 'disabled':
        return false;

      default:
        return null;
    }
  }
}
