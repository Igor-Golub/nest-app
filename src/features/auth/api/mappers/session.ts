import { SessionViewModel } from '../models/output';

export class SessionViewMapperManager {
  static mapSessionToView(dbModel): SessionViewModel {
    return {
      ip: dbModel.deviceId,
      title: dbModel.deviceName,
      deviceId: dbModel.deviceId,
      lastActiveDate: dbModel.version,
    };
  }
}
