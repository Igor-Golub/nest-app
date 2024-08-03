export declare enum RecoveryStatuses {
  Created = 1,
  Failed = 2,
  Success = 3,
}

export interface RecoveryEntity {
  code: string;
  ownerId: string;
  expirationAt: string;
  status: RecoveryStatuses;
}

export type RecoveryDBEntity = RecoveryEntity & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
