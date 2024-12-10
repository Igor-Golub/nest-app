export interface SessionEntity {
  ownerId: string;
  version: string;
  deviceId: string;
  deviceName: string;
  deviceIp: string;
  expirationDate: Date;
}

export type SessionDBEntity = SessionEntity & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
