import { SessionViewModel } from '../models/output';

export class SessionViewMapperManager {
  static mapSessionToView(dbModel): SessionViewModel {
    return {
      ip: dbModel.deviceIp,
      title: dbModel.deviceName,
      deviceId: dbModel.deviceId,
      lastActiveDate: dbModel.version,
    };
  }
}
