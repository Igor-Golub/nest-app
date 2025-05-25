import { Injectable } from '@nestjs/common';
import { validateSync } from 'class-validator';

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

  public static validateConfig(config: any) {
    const errors = validateSync(config);

    if (errors.length) {
      const sortedMessages = errors.map((error) => Object.values(error.constraints || {}).join(', ')).join(', ');

      throw new Error('Validation failed: ' + sortedMessages);
    }
  }
}
