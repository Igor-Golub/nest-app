import { SessionViewModel } from '../models/output';
import type { Session } from '../../domain/session.entity';

export class SessionViewMapperManager {
  static mapSessionToView(dbModel: Session): SessionViewModel {
    return {
      ip: dbModel.deviceIp,
      title: dbModel.deviceName,
      deviceId: dbModel.deviceId,
      lastActiveDate: dbModel.version,
    };
  }
}
