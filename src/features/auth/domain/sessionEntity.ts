export interface SessionEntity {
  ownerId: string;
  version: string;
  deviceId: string;
  deviceName: string;
  deviceIp: string;
}

export type SessionDBEntity = SessionEntity & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
